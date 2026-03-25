# Self-Assessment & Resume Evaluation — Development Prompt
**Version**: 1.0 | **Author**: Ankita Ingalagi | **Date**: March 2026
**Stack**: React · .NET Core Web API / Python FastAPI · LLM via Anthropic API · PostgreSQL/MongoDB

---

## 1. Problem Statement (JTBD)

**Who**: A PM or aspiring product professional looking to understand their current skill level and readiness for the job market.
**When**: During onboarding to the platform or when preparing for an upcoming job search.
**Outcome they want**: To get a realistic, data-backed breakdown of their competencies (e.g., product sense, execution, data, leadership) and a quantifiable "readiness" score, so they know exactly what skills to focus on.

**Root cause of the gap**: Self-assessments are inherently biased. Candidates don't know what they don't know. By combining a structured self-assessment questionnaire with an objective AI-driven review of their actual resume (optional), we bridge the gap between perceived and actual market readiness.

---

## 2. Feature Scope

| # | Feature | Priority | Kano Type |
|---|---------|----------|-----------|
| F1 | Multi-step self-assessment questionnaire | P0 | Basic |
| F2 | Optional resume upload (PDF/Docx) | P0 | Basic |
| F3 | LLM Resume parser & rubric evaluator | P0 | Performance |
| F4 | Competency breakdown & readiness scorecard | P0 | Performance |
| F5 | Personalised learning roadmap generation | P1 | Delighter |

**Anti-goals** (explicitly out of scope for v1):
- Auto-applying to jobs using the resume.
- LinkedIn profile syncing (manual resume upload only).
- Peer-to-peer resume reviews.

---

## 3. Feature Specifications (PRD)

### F1 — Assessment Questionnaire Interface
**User story**: As a user, I want to answer a structured set of questions about my experience so the system can gauge my baseline confidence across PM competencies.

**Acceptance criteria (BDD)**:
- Given I start the assessment, When the screen loads, Then I see a progress bar and a series of Likert-scale or scenario-based questions broken into categories (e.g., Product Strategy, Execution, Agile, Data).
- Given I complete a page, When I click Next, Then my answers are auto-saved to prevent data loss.
- Given I reach the end of the questionnaire, Then I am prompted to optionally upload my resume to calibrate my results.

### F2 — Optional Resume Upload
**User story**: As a user, I want the option to upload my resume so the AI can validate my self-assessment against market standards, but I want to be able to skip it if my resume isn't ready.

**Acceptance criteria (BDD)**:
- Given I finish the questionnaire, When I see the resume step, Then the "Upload Resume" CTA is prominent, but a "Skip for now" button is clearly visible.
- Given I choose to upload, When I drop a PDF or DOCX file, Then the file is validated for size (<5MB) and type.
- Given I skip the upload, When the results calculate, Then my readiness score is generated *only* using my self-assessment inputs, with a notification that "Adding a resume increases accuracy by up to 40%."

### F3 — Competency Breakdown & Readiness Calculation
**User story**: As a user who has submitted my data, I want to see a clear breakdown of my strengths and gaps, alongside a "readiness" percentage, so I know where I stand.

**Acceptance criteria (BDD)**:
- Given my data is submitted, When the calculation completes, Then I see a "Market Readiness" score (e.g., 72% Ready for Senior PM).
- Given the scorecard renders, When I view the Competency Radar Chart, Then I see my scores across: Product Sense, Strategic Thinking, Execution, Data Acumen, and Leadership.
- Given I uploaded a resume, When the AI identifies a discrepancy (e.g., high self-assessment in Data, but no metrics on resume), Then a specific insight card explains the gap ("Your resume doesn't reflect your analytical skills. Add metrics to bullet points 2 and 4.").
- Given I did not upload a resume, Then the discrepancy insights are hidden.

---

## 4. System Architecture & AI Integration

### 4.1 AI Resume Evaluator & Calibration Logic
- **Trigger**: User completes questionnaire and (optionally) uploads a resume. If a resume is provided, text is extracted via a parser (e.g., PyPDF2 or equivalent cloud service).
- **Prompt Architecture**: 
  - **Inputs**: User's self-assessment JSON, Raw parsed resume text.
  - **System Prompt Instructions**:
    1. Evaluate the resume against standard PM rubrics (Impact phrasing, clarity, metrics, frameworks).
    2. Map the resume extracted skills to the 5 core competencies.
    3. Cross-reference the resume's implied level with the user's self-assessment. If the user rates themselves a 5/5 in execution but lists zero shipped features, adjust the blended score downwards.
  - **Output Schema (Strict JSON)**:
    ```json
    {
      "readinessScore": 0-100,
      "competencies": {
        "productSense": 1-5,
        "execution": 1-5,
        "dataAcumen": 1-5,
        "strategy": 1-5,
        "leadership": 1-5
      },
      "resumeDiscrepancies": ["insight 1", "insight 2"],
      "actionableFeedback": "string"
    }
    ```

### 4.2 Data Flow
1. **Frontend**: React handles multi-step form state. Resume is converted to base64 or uploaded to a staging bucket (S3).
2. **Backend**: API receives questionnaire payload and resume reference.
3. If Resume = True -> API triggers parsed text extraction -> Calls LLM (e.g., Claude 3.5 Sonnet) with the Calibration Prompt.
4. If Resume = False -> API calculates baseline score via deterministic logic or a lighter LLM Prompt purely on self-assessment.
5. **Database**: Store the resulting `Scorecard` document linked to the `userId`.
6. Return Scorecard JSON to frontend to render charts and insights.

---

## 5. Success Metrics

| Key Result | Target | Measurement |
|-----------|--------|-------------|
| Funnel completion rate | ≥ 75% | From Start Assessment -> Scorecard View |
| Resume upload opt-in rate | ≥ 60% | Percentage of users who do not skip upload |
| Prompt format failure rate | < 2% | JSON parsing errors from LLM |
| Subsequent action conversion | ≥ 40% | Users who view scorecard and subsequently enroll in a course or book a mentor |

---

## 6. Open Technical Risks
- **Resume Formatting Variety**: PDFs can have complex columns causing poor text extraction. *Mitigation: Use an LLM with Vision capabilities if simple text parsing fails, or strip aggressive formatting before evaluating.*
- **Hallucinated Feedback**: LLM might critique something that *is* actually on the resume due to phrasing. *Mitigation: Prompt must specify "Quote exactly from the resume before noting a gap".*
