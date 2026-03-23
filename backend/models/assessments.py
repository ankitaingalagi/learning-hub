from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


# ── Request Models ────────────────────────────────────────────────────────────

class AnswerItem(BaseModel):
    question_id: str
    selected_option_id: str  # "a" | "b" | "c" | "d"


class SubmitRequest(BaseModel):
    profile_id: str
    answers: list[AnswerItem]


# ── Response Models ───────────────────────────────────────────────────────────

class AssessmentResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    created_at: datetime


class OptionItem(BaseModel):
    id: str
    text: str
    score: int


class QuestionResponse(BaseModel):
    id: str
    text: str
    options: list[OptionItem]


class CompetencyScore(BaseModel):
    competency: str
    score: int
    max_score: int
    percentage: float


class SubmitResponse(BaseModel):
    result_id: str
    total_score: int
    max_possible_score: int
    percentage: float
    competency_breakdown: list[CompetencyScore]


class AssessmentResultResponse(BaseModel):
    id: str
    assessment_id: str
    assessment_title: str
    score: int
    created_at: datetime
