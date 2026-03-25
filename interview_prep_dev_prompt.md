# Interview Prep Feature — Development Prompt
**Version**: 1.0 | **Author**: Ankita Ingalagi | **Date**: March 2026  
**Stack**: React · .NET Core Web API · AWS Lambda · MongoDB · CosmosDB · S3 · LLM via Anthropic API

---

## 1. Problem Statement (JTBD)

**Who**: A PM / product professional or software engineer preparing for a role change or promotion  
**When**: 2–4 weeks before interviews; practicing solo without access to a coach  
**Outcome they want**: Walk into interviews feeling practiced, not just prepared — with honest, structured feedback that mirrors how a real hiring manager thinks

**Root cause of the gap**: Most preparation is passive (reading articles, watching videos). There is no low-friction way to simulate an interview conversation, get rubric-grounded feedback per answer, and understand how a hiring manager would actually interpret what you said.

---

## 2. Feature Scope

| # | Feature | Priority | Kano Type |
|---|---------|----------|-----------|
| F1 | Interview type selector | P0 | Basic |
| F2 | AI mock interview — chat, 5–6 Qs | P0 | Basic |
| F3 | Per-answer structured feedback | P0 | Performance |
| F4 | End-of-session scorecard | P0 | Performance |
| F5 | Past sessions list + transcript review | P1 | Performance |
| F6 | Quick resource cards | P1 | Delighter |
| F7 | Hiring manager perspective (feedback loop) | P1 | Delighter |

**Anti-goals** (explicitly out of scope for v1):
- Live video interview simulation
- Peer-to-peer mock sessions
- Resume parsing or JD parsing as question source
- Integration with ATS or job boards

---

## 3. Feature Specifications (PRD)

---

### F1 — Interview Type Selector

**User story**: As a user starting a session, I want to select the type of interview I'm practicing for so the AI generates questions appropriate to that context.

**Acceptance criteria (BDD)**:
- Given I land on the Interview Prep screen, When I see the selector, Then I see exactly 4 options: Product Design, Strategy, Analytical, Behavioural
- Given I select a type, When I press "Start Session", Then a new session is created with that type, and the first question is rendered in the chat interface
- Given I have not selected a type, When I press "Start Session", Then a validation error is shown and no session is created
- Given I am mid-session, When I navigate back, Then I see a "Session in progress" warning before I can exit

**Success metric**: >85% of users who land on selector proceed to start a session (no drop-off at type selection)  
**Anti-goal**: Does not support custom interview types in v1  
**Dependencies**: Session API (POST /sessions), LLM question generator prompt templates per type  
**Open questions**: Should type selection be locked once a session starts, or allow mid-session switching?

---

### F2 — AI Mock Interview Chat Interface

**User story**: As a user in an active session, I want to answer questions in a conversational chat UI so that the experience feels like a real interview, not a form.

**Acceptance criteria (BDD)**:
- Given a session is started, When the session initialises, Then question 1 of 5 is displayed immediately (no loading > 2s)
- Given I submit an answer, When the LLM processes it, Then the next question is displayed within 3 seconds (streaming preferred)
- Given I have answered 5 questions, When I submit the 5th answer, Then the session transitions to the scorecard state — no 6th question is generated
- Given I type an answer of fewer than 20 words, When I submit, Then a soft prompt is shown: "Your answer seems short — would you like to add more detail?" with options to proceed or expand
- Given a network timeout occurs mid-session, When the page reloads, Then the session is restored from last saved state
- Given the LLM API returns an error, When the question fails to render, Then a fallback message is shown: "We're having trouble generating the next question. Please try again." — no session is lost

**Session structure**:
```
Session
  ├── type: ProductDesign | Strategy | Analytical | Behavioural
  ├── status: InProgress | Completed | Abandoned
  ├── questions[]: { id, text, generatedAt }
  └── answers[]: { questionId, text, submittedAt, feedback: { ... } }
```

**Success metric**: Average session completion rate ≥ 60% (users who start also submit all 5 answers)  
**Anti-goal**: No voice input in v1. No interviewer persona role-play (just Q&A flow)  
**Dependencies**: LLM question generator (AWS Lambda), session persistence (MongoDB), streaming API response support in .NET  
**Build vs. integrate**: Build the chat UI in React. Integrate LLM via Anthropic Claude API (not build question logic in-house)

---

### F3 — Per-Answer Structured AI Feedback

**User story**: As a user who has submitted an answer, I want to see structured feedback immediately so I understand what I did well and what to improve before moving to the next question.

**Acceptance criteria (BDD)**:
- Given I submit an answer, When feedback is generated, Then it is displayed inline below my answer in the chat — not in a separate panel
- Given feedback is displayed, When I review it, Then it contains exactly 3 structured sections: Strengths, Gaps, Suggested improvement (each labelled)
- Given a very short or incoherent answer, When the LLM evaluates it, Then feedback acknowledges the brevity and provides a model response example rather than generic praise
- Given feedback is shown, When I click "Continue", Then the next question renders — feedback is not collapsed or dismissed automatically
- Given a session is completed, When I view the transcript later, Then per-answer feedback is preserved in full

**Feedback schema** (LLM output, JSON-structured):
```json
{
  "questionId": "uuid",
  "strengths": ["string"],
  "gaps": ["string"],
  "suggestion": "string",
  "score": { "structure": 1-5, "clarity": 1-5, "depth": 1-5, "pmThinking": 1-5 }
}
```

**LLM prompt contract**:
- Input: `{ interviewType, question, answer }`
- System prompt: role-contextual evaluator with rubric (see AI Integration section)
- Output: structured JSON as above — validated server-side before returning to client
- Fallback: if JSON parse fails, retry once; if retry fails, return a graceful "Feedback unavailable" message with the raw answer preserved

**Success metric**: Per-answer feedback NPS ≥ 40 (in-app thumbs up/down per feedback block)  
**Anti-goal**: Feedback does not rewrite the user's answer for them — it points, not replaces  
**Dependencies**: Feedback API (POST /sessions/{id}/answers/{answerId}/feedback), CosmosDB feedback store  

---

### F4 — End-of-Session Scorecard

**User story**: As a user who has completed all 5 questions, I want to see an aggregated scorecard so I can understand my overall performance and which dimensions need the most work.

**Acceptance criteria (BDD)**:
- Given I submit my 5th answer, When the session ends, Then the scorecard screen is shown automatically (no additional navigation required)
- Given the scorecard is shown, When I view it, Then I see 5 dimensions scored 1–5: Structure, Clarity, Depth, PM Thinking, Overall
- Given the scorecard is shown, When I view it, Then I see one "Top strength" and one "Priority to improve" synthesised across all answers
- Given I have completed multiple sessions of the same type, When I view a scorecard, Then I see a delta indicator (↑ ↓ →) showing change vs. my previous session of the same type
- Given the scorecard is displayed, When I click "Review Answers", Then I am taken to the session transcript view with all questions, answers, and per-answer feedback visible

**Score computation**: Aggregate per-answer scores as arithmetic mean per dimension, rounded to 1 decimal  
**Overall score**: Weighted mean — Structure 20%, Clarity 20%, Depth 30%, PM Thinking 30%

**Success metric**: Scorecard share rate ≥ 15% (users who use a "Copy scorecard" or share action)  
**Anti-goal**: Scorecard does not rank users against each other — no percentile or leaderboard in v1  
**Dependencies**: All 5 per-answer feedback records must be persisted before scorecard is computed  
**Open question**: Should "Overall" score be surfaced as a single number, or deliberately omitted to avoid gamification?

---

### F5 — Past Sessions List + Transcript Review

**User story**: As a returning user, I want to browse my past sessions and replay transcripts so I can track progress over time and revisit feedback.

**Acceptance criteria (BDD)**:
- Given I navigate to "Past Sessions", When the page loads, Then I see a list sorted by most recent first, showing: date, interview type, overall score, session duration
- Given I have no past sessions, When I land on Past Sessions, Then I see an empty state with a CTA to start my first session
- Given I click a session, When it opens, Then I see the full transcript: each question, my answer, and the per-answer feedback — in the original sequence
- Given I am on the transcript view, When I click any feedback block, Then it expands to show the full Strengths / Gaps / Suggestion detail
- Given I have more than 10 sessions, When I scroll, Then additional sessions are loaded via infinite scroll (10 at a time, paginated API)

**Success metric**: Return session rate ≥ 30% of users who completed ≥1 session start a second session within 7 days  
**Anti-goal**: No session deletion in v1 (permanent record — user-initiated delete is a v2 feature)  
**Dependencies**: History API (GET /sessions, GET /sessions/{id}/transcript), MongoDB sessions collection, CosmosDB feedback + S3 transcript store  

---

### F6 — Quick Resource Cards

**User story**: As a user between sessions or before starting one, I want quick access to reference cards so I can refresh frameworks and checklists without leaving the app.

**Cards in v1 (static content, CMS-managed)**:
- Framework guide: STAR, CIRCLES, RICE, MECE, root cause analysis
- Common question bank: top 15 questions per interview type
- Resume checklist: impact phrasing, quantification, PM-specific signals

**Acceptance criteria (BDD)**:
- Given I am on the home screen, When I scroll, Then resource cards are visible without requiring navigation
- Given I click a card, When it opens, Then content renders in a drawer (not a new route) — preserving my place on the home screen
- Given I am in an active session, When I open a resource card, Then a warning is shown: "Opening resources will pause your session timer" (for future timed mode compatibility)

**Build vs. integrate**: Static JSON served from S3 + CloudFront CDN. No DB write required. CMS-managed in v2.  
**Success metric**: Resource card open rate ≥ 20% of weekly active users  

---

### F7 — Hiring Manager Perspective (Feedback Loop Initiator)

**User story**: As a user reviewing my scorecard, I want to see how a hiring manager would interpret my answers so I understand the decision-making lens I'm being evaluated through — not just the rubric.

**What this is**: A distinct LLM call using a "Hiring Manager Persona" prompt that interprets the user's session from the perspective of a real interviewer. Not a re-score — an interpretive layer.

**Acceptance criteria (BDD)**:
- Given I have completed a session, When I click "See hiring manager view" on the scorecard, Then a 3–5 sentence HM interpretation is generated (async, <5s)
- Given the HM view is shown, When I read it, Then it surfaces: one "red flag" signal, one "green flag" signal, and a one-sentence hiring decision framing ("Based on this session, a typical HM would...")
- Given the HM view is shown, When I see a signal I disagree with, Then I can click "Give feedback" to flag it — this feedback is stored for model improvement (human override pattern)
- Given the LLM returns a HM view that is generic or non-specific, When I see it, Then a confidence indicator is shown ("Low specificity — try adding more detail in answers")

**This is assistive, not agentic**: HM view surfaces and suggests. It does not take action, does not auto-send anything, and has no downstream effect on the session record.

**Human override point**: User can flag any HM signal as "inaccurate" — stored in feedback collection with session context. Used for future prompt tuning.

**Hallucination guard**: HM persona prompt explicitly anchors to the actual question and answer text provided — no fabricated context allowed. Output is validated for reference to actual content before rendering.

**Success metric**: HM view engagement rate ≥ 35% of scorecard views  
**Anti-goal**: HM view does not simulate a specific company or role — generic PM/tech hiring lens only in v1

---

## 4. System Architecture

### 4.1 Component Map

```
React SPA (Vite + TypeScript)
    ↓ REST (JWT auth)
.NET Core Web API (ASP.NET, C#)
    ├── Session Controller     → MongoDB (session state)
    ├── Feedback Controller    → AWS Lambda (async LLM call) → CosmosDB (feedback records)
    ├── History Controller     → MongoDB + CosmosDB + S3 (transcript retrieval)
    └── HM Persona Controller  → AWS Lambda (HM prompt) → CosmosDB (HM view + user flags)

AWS Lambda Functions:
    ├── QuestionGeneratorFn    → Anthropic API (Claude claude-sonnet-4-20250514)
    ├── AnswerEvaluatorFn      → Anthropic API (structured JSON output)
    └── HMPersonaFn            → Anthropic API (persona-contextualised interpretation)

Data Stores:
    ├── MongoDB               → Sessions collection (mutable state, frequent writes)
    ├── CosmosDB              → Feedback + HM view records (read-heavy, append-only)
    └── S3                    → Raw transcript files (append-only, never modified)

Auth: OAuth 2.0 / JWT (existing app auth pattern)
CDN: CloudFront → S3 (resource cards static content)
IaC: CloudFormation (all infra defined as code, no manual provisioning)
CI/CD: AWS CodePipeline
```

### 4.2 Data Flow — Active Session

```
1. User selects type → POST /sessions → MongoDB session record created
2. .NET API → invokes QuestionGeneratorFn (Lambda)
   → Input: { type, questionIndex: 0, previousQuestions: [] }
   → Output: { questionText }
3. Question streamed to React UI via Server-Sent Events (SSE)
4. User submits answer → POST /sessions/{id}/answers
   → Answer persisted to MongoDB immediately (before feedback)
5. .NET API → invokes AnswerEvaluatorFn (Lambda, async)
   → Input: { type, question, answer }
   → Output: { strengths[], gaps[], suggestion, score{} }
6. Feedback persisted to CosmosDB
7. Feedback returned to client (inline rendering)
8. Repeat steps 2–7 for questions 2–5
9. After Q5: POST /sessions/{id}/complete
   → Scorecard computed server-side from 5 feedback records
   → Session status updated to Completed in MongoDB
   → Full transcript written to S3 (raw JSON)
```

### 4.3 AI Integration Architecture

#### QuestionGeneratorFn

```
Type: Assistive (returns question text, user chooses to proceed)
Model: claude-sonnet-4-20250514
Trigger: POST /sessions (session start) + POST /sessions/{id}/answers (each submission)
Context assembled:
  - Interview type (system prompt variant)
  - Previously asked questions in this session (dedup guard)
  - Question index (1–5, used to vary difficulty curve)
Token budget: ~800 input + 200 output per call
Streaming: Yes — SSE to client for question rendering
Human override: None needed (user reads question before answering)
Failure path: If Lambda times out (>10s), serve a pre-seeded fallback question
  from the static question bank (same type). Never block session on LLM failure.
Hallucination guard: Prompt explicitly instructs model to generate only
  interview-style questions — no external claims, no factual assertions.
Cost at 1K users × 5 sessions × 5 questions: ~25,000 calls/month → ~$15–25/mo
```

#### AnswerEvaluatorFn

```
Type: Assistive (feedback surfaced, user decides what to do with it)
Model: claude-sonnet-4-20250514
Trigger: POST /sessions/{id}/answers (each submission)
Context assembled:
  - Interview type + question text
  - User's answer verbatim
  - Rubric (embedded in system prompt): Structure, Clarity, Depth, PM Thinking
  - Output format instruction: strict JSON schema (validated server-side)
Token budget: ~1200 input + 400 output per call
Streaming: No — feedback rendered after full JSON is validated
Human override: User can flag feedback as unhelpful (stored in feedback.flags[])
Low confidence path: If score variance is high (all dimensions ≤ 2 with short answer),
  append: "Consider expanding your answer — this feedback may be limited by brevity."
Failure path: If JSON schema validation fails after 1 retry, return
  { error: "FeedbackUnavailable" } — client shows graceful message,
  answer is preserved, session continues.
Hallucination guard: System prompt anchors strictly to provided question+answer text.
  Explicitly prohibited from inventing context or credentials for the user.
Cost at 1K users × 5 sessions × 5 answers: ~25,000 calls/month → ~$30–50/mo
```

#### HMPersonaFn

```
Type: Assistive (interpretation only, no downstream action)
Model: claude-sonnet-4-20250514
Trigger: User-initiated (click "See hiring manager view" on scorecard)
Context assembled:
  - All 5 questions + answers from session
  - Aggregate scorecard dimensions
  - Interview type → maps to HM persona variant in system prompt
  - Explicit instruction: "You are reviewing this session as a hiring manager.
    Surface one red flag, one green flag, and a one-sentence decision framing.
    Ground every observation in the actual answer text provided."
Token budget: ~2000 input + 500 output per call
Streaming: No — full response rendered once validated
Human override: User can flag any signal as inaccurate
  → Stored: { sessionId, signal, flagType: "inaccurate", createdAt }
  → Used for prompt iteration, not real-time model adjustment
Low specificity detection: If output contains no direct reference to the
  user's answer text (regex check on keywords), flag response as
  low_specificity = true → client shows confidence indicator
Failure path: If call fails, show "HM view unavailable" with retry option.
  Session scorecard is never blocked by HM view failure.
Cost at 30% engagement × 1K users × 5 sessions: ~1,500 calls/month → ~$5–8/mo
```

### 4.4 Data Models

#### MongoDB — Sessions Collection

```json
{
  "_id": "uuid",
  "userId": "uuid",
  "type": "ProductDesign | Strategy | Analytical | Behavioural",
  "status": "InProgress | Completed | Abandoned",
  "startedAt": "ISO8601",
  "completedAt": "ISO8601 | null",
  "questions": [
    { "id": "uuid", "text": "string", "index": 0, "generatedAt": "ISO8601" }
  ],
  "answerIds": ["uuid"],
  "scorecardRef": "uuid | null",
  "transcriptS3Key": "string | null"
}
```

#### CosmosDB — Feedback Collection

```json
{
  "id": "uuid",
  "sessionId": "uuid",
  "questionId": "uuid",
  "userId": "uuid",
  "strengths": ["string"],
  "gaps": ["string"],
  "suggestion": "string",
  "scores": {
    "structure": 1,
    "clarity": 1,
    "depth": 1,
    "pmThinking": 1
  },
  "flags": [],
  "createdAt": "ISO8601",
  "modelVersion": "claude-sonnet-4-20250514"
}
```

#### CosmosDB — HM Views Collection

```json
{
  "id": "uuid",
  "sessionId": "uuid",
  "userId": "uuid",
  "redFlag": "string",
  "greenFlag": "string",
  "decisionFraming": "string",
  "lowSpecificity": false,
  "userFlags": [],
  "createdAt": "ISO8601"
}
```

### 4.5 API Contracts

| Method | Route | Description |
|--------|-------|-------------|
| POST | /sessions | Start session, generate Q1 |
| GET | /sessions | List user's sessions (paginated, 10/page) |
| GET | /sessions/{id} | Session detail + scorecard |
| POST | /sessions/{id}/answers | Submit answer, trigger feedback Lambda |
| GET | /sessions/{id}/transcript | Full transcript with feedback |
| POST | /sessions/{id}/complete | Mark complete, compute scorecard |
| POST | /sessions/{id}/hm-view | Generate HM perspective |
| POST | /sessions/{id}/hm-view/flag | User flags HM signal |
| GET | /resources | List resource cards (cached, CDN-backed) |

### 4.6 Failure Modes

| Failure | Impact | Detection | Recovery |
|---------|--------|-----------|----------|
| LLM API timeout (question gen) | Session stalls | Lambda timeout metric | Serve fallback question from static bank |
| LLM API timeout (feedback) | Feedback missing for answer | Lambda error log | Return FeedbackUnavailable, preserve answer, continue session |
| MongoDB write failure | Session state lost | Connection error | Retry 3× with exponential backoff; surface error to user if all fail |
| CosmosDB unavailable | Scorecard cannot compute | Health check | Cache last known scorecard in session doc; compute from MongoDB |
| S3 write failure | Transcript not persisted | S3 error event | Retry async via EventBridge; do not block session completion |
| Scorecard computation error | Scorecard blank | API 5xx | Show partial scorecard with available dimensions; flag for manual review |

---

## 5. Prioritisation (RICE)

| Feature | Reach | Impact | Confidence | Effort | RICE | Decision |
|---------|-------|--------|------------|--------|------|----------|
| F1 Type selector | 100% | 4 | 95% | S | 380 | ✅ Ship (MLP) |
| F2 Mock interview chat | 100% | 5 | 90% | L | 450 | ✅ Ship (MLP) |
| F3 Per-answer feedback | 100% | 5 | 85% | M | 425 | ✅ Ship (MLP) |
| F4 Scorecard | 95% | 4 | 90% | M | 342 | ✅ Ship (MLP) |
| F5 Past sessions | 70% | 4 | 80% | M | 224 | ✅ Ship (v1) |
| F6 Resource cards | 60% | 3 | 85% | S | 153 | ✅ Ship (v1) |
| F7 HM perspective | 50% | 4 | 70% | M | 140 | ✅ Ship (v1, post-MLP) |

**MLP boundary**: F1 + F2 + F3 + F4. A session that starts, runs, and scores is the minimum lovable product.  
**What gets cut for MLP**: F5, F6, F7 deferred to sprint 2 — product works without them.

**Build sequence**:
1. De-risk: LLM feedback quality spike (week 1 — build AnswerEvaluatorFn in isolation, test rubric calibration on 20 real answers)
2. Core session loop: F1 + F2 + F3 (week 2–3)
3. Scorecard: F4 (week 3)
4. History + resources: F5 + F6 (week 4)
5. HM persona: F7 (week 5 — dependent on feedback loop design being validated)

---

## 6. Success Metrics (OKRs)

**Objective**: Make interview prep measurably effective for users practicing solo

| Key Result | Target | Measurement |
|-----------|--------|-------------|
| Session completion rate | ≥ 60% of started sessions | Events: session_started, session_completed |
| Return session rate (7-day) | ≥ 30% | Cohort: users with ≥2 sessions within 7 days |
| Per-answer feedback usefulness | ≥ 70% thumbs up | Feedback: feedback_rated_helpful |
| Scorecard engagement | ≥ 80% of completions view scorecard | Event: scorecard_viewed |
| HM view engagement | ≥ 35% of scorecard views | Event: hm_view_opened |

**Leading indicator to watch in week 1**: Average session completion rate — if below 40%, problem is in the chat UX or question quality, not the scorecard.

---

## 7. Open Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| LLM feedback quality inconsistent across answer types | Medium | High | Spike: evaluate rubric prompt on 50 real answers before sprint 1 ships |
| Streaming SSE reliability in .NET → React under load | Medium | Medium | Load test at 50 concurrent sessions before launch |
| CosmosDB partition key choice affects feedback read latency | Low | Medium | Partition by userId; index sessionId — validate with query plan |
| HM persona generates generic/hallucinated signals | High | Medium | Anchor guard in system prompt + low_specificity detector pre-launch |
| Token cost overrun at scale | Low | Medium | Cost cap per session enforced at Lambda level; alert at 80% budget |

---

## 8. What This Does NOT Build (v1)

- Real-time video or voice interview mode
- JD / resume ingestion as question context
- Peer interview pairing
- Percentile ranking or leaderboards
- Company-specific interview simulations
- Calendar scheduling or reminder system

---

*Built on: React · .NET Core · AWS Lambda · MongoDB · CosmosDB · S3 · Anthropic Claude API*  
*IaC: CloudFormation | CI/CD: AWS CodePipeline | Auth: OAuth 2.0 / JWT*
