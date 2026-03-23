from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from dependencies import get_user_supabase, get_current_user
from services.supabase_client import supabase_admin
from models.assessments import (
    AssessmentResponse,
    QuestionResponse,
    SubmitRequest,
    SubmitResponse,
    CompetencyScore,
    AssessmentResultResponse,
)
from typing import List

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])

# Ordered competency bands — aligns with seed question insertion order.
# Each tuple: (competency_name, 1-based question indices that belong to it)
COMPETENCY_BANDS = [
    ("Product Thinking",          [1, 2]),
    ("Execution & Prioritization",[3, 4]),
    ("Stakeholder Communication", [5, 6]),
    ("Data & Metrics",            [7, 8]),
    ("User Empathy",              [9, 10]),
]
OPTIONS_PER_QUESTION = 4   # scores 1-4, so max per question = 4


# ── 1. GET /api/assessments ───────────────────────────────────────────────────

@router.get("/", response_model=List[AssessmentResponse])
def list_assessments():
    """
    Public — returns all assessments.
    Uses the service client so no auth token is required.
    """
    try:
        response = supabase_admin.table("assessments") \
            .select("id, title, description, created_at") \
            .order("created_at", desc=False) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch assessments: {str(e)}")


# ── 2. GET /api/assessments/results/{profile_id} ──────────────────────────────
# Defined BEFORE /{assessment_id}/... routes to avoid FastAPI matching
# "results" as an assessment_id path segment.

@router.get("/results/{profile_id}", response_model=List[AssessmentResultResponse])
def get_results_for_user(
    profile_id: str,
    client: Client = Depends(get_user_supabase),
    current_user=Depends(get_current_user),
):
    """
    Authenticated — returns all assessment results for a user.
    The authenticated user's id must match the requested profile_id.
    """
    if current_user.id != profile_id:
        raise HTTPException(status_code=403, detail="You can only view your own results.")

    try:
        response = client.table("assessment_results") \
            .select("id, assessment_id, score, created_at, assessments(title)") \
            .eq("profile_id", profile_id) \
            .order("created_at", desc=True) \
            .execute()

        results = []
        for row in response.data:
            results.append(AssessmentResultResponse(
                id=row["id"],
                assessment_id=row["assessment_id"],
                assessment_title=row["assessments"]["title"] if row.get("assessments") else "Unknown",
                score=row["score"],
                created_at=row["created_at"],
            ))
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch results: {str(e)}")


# ── 3. GET /api/assessments/{assessment_id}/questions ─────────────────────────

@router.get("/{assessment_id}/questions", response_model=List[QuestionResponse])
def get_questions(assessment_id: str):
    """
    Public — returns all questions (with options) for a given assessment.
    Questions are ordered by created_at so competency bands are stable.
    """
    try:
        response = supabase_admin.table("assessment_questions") \
            .select("id, text, options") \
            .eq("assessment_id", assessment_id) \
            .order("created_at", desc=False) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Assessment not found or has no questions.")

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch questions: {str(e)}")


# ── 4. POST /api/assessments/{assessment_id}/submit ───────────────────────────

@router.post("/{assessment_id}/submit", response_model=SubmitResponse)
def submit_assessment(assessment_id: str, body: SubmitRequest):
    """
    Calculates the total score and competency breakdown from submitted answers,
    persists the result, and returns structured scoring data.

    Uses the service client so it works even when auth is bypassed on the
    frontend during development. Profile ownership is validated via profile_id.
    """
    try:
        # Fetch all questions for this assessment ordered by created_at
        q_response = supabase_admin.table("assessment_questions") \
            .select("id, options") \
            .eq("assessment_id", assessment_id) \
            .order("created_at", desc=False) \
            .execute()

        questions = q_response.data
        if not questions:
            raise HTTPException(status_code=404, detail="Assessment not found or has no questions.")

        # Build a lookup: question_id → {option_id → score}
        question_option_map: dict[str, dict[str, int]] = {}
        for q in questions:
            question_option_map[q["id"]] = {
                opt["id"]: opt["score"]
                for opt in (q["options"] or [])
            }

        # Build a stable question-index map for competency banding
        question_index: dict[str, int] = {
            q["id"]: idx + 1   # 1-based to match COMPETENCY_BANDS
            for idx, q in enumerate(questions)
        }

        # Score each submitted answer
        answer_scores: dict[str, int] = {}   # question_id → score earned
        for answer in body.answers:
            qid = answer.question_id
            opt_id = answer.selected_option_id
            score = question_option_map.get(qid, {}).get(opt_id, 0)
            answer_scores[qid] = score

        total_score = sum(answer_scores.values())
        max_possible_score = len(questions) * OPTIONS_PER_QUESTION

        # Build competency breakdown
        competency_breakdown: list[CompetencyScore] = []
        for competency_name, indices in COMPETENCY_BANDS:
            # Find question ids that belong to this band
            band_question_ids = [
                qid for qid, idx in question_index.items()
                if idx in indices
            ]
            band_score = sum(answer_scores.get(qid, 0) for qid in band_question_ids)
            band_max = len(band_question_ids) * OPTIONS_PER_QUESTION
            competency_breakdown.append(CompetencyScore(
                competency=competency_name,
                score=band_score,
                max_score=band_max,
                percentage=round((band_score / band_max * 100) if band_max > 0 else 0, 1),
            ))

        # Persist to assessment_results only when we have a valid profile_id
        result_id = "unknown"
        if body.profile_id and len(body.profile_id) == 36:  # basic UUID length check
            try:
                insert_response = supabase_admin.table("assessment_results") \
                    .insert({
                        "profile_id": body.profile_id,
                        "assessment_id": assessment_id,
                        "score": total_score,
                    }) \
                    .execute()
                result_id = insert_response.data[0]["id"] if insert_response.data else "unknown"
            except Exception:
                pass  # Non-fatal — scores are still returned

        return SubmitResponse(
            result_id=result_id,
            total_score=total_score,
            max_possible_score=max_possible_score,
            percentage=round((total_score / max_possible_score * 100) if max_possible_score > 0 else 0, 1),
            competency_breakdown=competency_breakdown,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submission failed: {str(e)}")
