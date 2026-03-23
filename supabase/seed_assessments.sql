-- Seed: PM Readiness Assessment
-- Run with: npx supabase db execute --file supabase/seed_assessments.sql --project-ref gfbubrfezoqakoogjiqt

DO $$
DECLARE
  assessment_id uuid;
BEGIN

-- ─── Insert Assessment ────────────────────────────────────────────────────────
INSERT INTO assessments (title, description)
VALUES (
  'PM Readiness Assessment',
  'Evaluate your current PM skills across 5 core competencies'
)
RETURNING id INTO assessment_id;

-- ─── Product Thinking (Q1–Q2) ────────────────────────────────────────────────

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'Your engineering team just cut 30% of the features you planned for a launch in 3 weeks. What do you do first?',
 '[
   {"id": "a", "text": "Escalate to leadership to push back on the engineering timeline", "score": 1},
   {"id": "b", "text": "Accept the cuts and ship whatever is ready without revisiting priorities", "score": 2},
   {"id": "c", "text": "Rewrite the PRD to remove the cut features and update stakeholders", "score": 3},
   {"id": "d", "text": "Revisit the feature list with the team to identify which 70% delivers the core user value, and redefine the MVP scope", "score": 4}
 ]'::jsonb
);

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'You are defining the vision for a new B2B feature. Two large enterprise customers have requested very different things. How do you proceed?',
 '[
   {"id": "a", "text": "Build both versions to keep both customers happy", "score": 1},
   {"id": "b", "text": "Build the version requested by the customer with the larger contract value", "score": 2},
   {"id": "c", "text": "Interview both customers to uncover the underlying job-to-be-done and look for a solution that addresses both needs", "score": 4},
   {"id": "d", "text": "Ask your manager to decide which customer to prioritize", "score": 1}
 ]'::jsonb
);

-- ─── Execution & Prioritization (Q3–Q4) ──────────────────────────────────────

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'You have 4 items in your backlog: a critical bug affecting 5% of users, a high-impact growth experiment, a compliance requirement due next quarter, and a feature requested by your CEO. How do you prioritize?',
 '[
   {"id": "a", "text": "CEO feature first — executive visibility matters most", "score": 1},
   {"id": "b", "text": "Critical bug first, then compliance, then evaluate the growth experiment vs. CEO feature using impact/effort", "score": 4},
   {"id": "c", "text": "Growth experiment first since it has the highest potential ROI", "score": 2},
   {"id": "d", "text": "Work on all four in parallel to show progress everywhere", "score": 1}
 ]'::jsonb
);

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'It is mid-sprint and a high-severity bug is reported. Fixing it will consume 60% of your remaining sprint capacity. What do you do?',
 '[
   {"id": "a", "text": "Add it to the next sprint to avoid disrupting the current plan", "score": 2},
   {"id": "b", "text": "Fix it immediately and silently drop other sprint commitments", "score": 2},
   {"id": "c", "text": "Assess severity and user impact, then communicate transparently with stakeholders about the trade-off before deciding", "score": 4},
   {"id": "d", "text": "Ask engineering to work overtime so nothing gets dropped", "score": 1}
 ]'::jsonb
);

-- ─── Stakeholder Communication (Q5–Q6) ───────────────────────────────────────

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'Sales promises a key prospect a custom feature that is not on your roadmap. You find out the day after the commitment is made. What is your response?',
 '[
   {"id": "a", "text": "Build it — keeping the deal is top priority", "score": 1},
   {"id": "b", "text": "Tell Sales that promises made without product approval are their problem to fix", "score": 1},
   {"id": "c", "text": "Meet with Sales to understand the deal context, evaluate if the feature aligns with your strategy, and give a clear yes/no with reasoning", "score": 4},
   {"id": "d", "text": "Add it to the backlog and let the prioritization process handle it", "score": 2}
 ]'::jsonb
);

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'You need to present a roadmap change that will disappoint a key internal stakeholder. How do you approach the conversation?',
 '[
   {"id": "a", "text": "Send a written update over Slack to avoid a difficult live conversation", "score": 1},
   {"id": "b", "text": "Schedule a meeting, lead with the data and strategic rationale, acknowledge the impact, and propose alternatives", "score": 4},
   {"id": "c", "text": "Wait until the quarterly review to bring it up formally", "score": 1},
   {"id": "d", "text": "Have your manager deliver the news on your behalf", "score": 2}
 ]'::jsonb
);

-- ─── Data & Metrics (Q7–Q8) ──────────────────────────────────────────────────

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'You launched a feature 2 weeks ago. Daily active usage is high but your 30-day retention for that feature is dropping. What is your diagnosis approach?',
 '[
   {"id": "a", "text": "Assume the feature is successful since daily usage is high", "score": 1},
   {"id": "b", "text": "Immediately ship improvements without further investigation", "score": 1},
   {"id": "c", "text": "Segment retention by user cohort and use case, review session recordings, and run user interviews to identify drop-off reasons", "score": 4},
   {"id": "d", "text": "Look at the retention numbers again next month before taking action", "score": 2}
 ]'::jsonb
);

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'You are setting the success metric for a new onboarding flow. Which metric best captures whether the onboarding is actually working?',
 '[
   {"id": "a", "text": "Number of users who complete all onboarding steps", "score": 2},
   {"id": "b", "text": "Time spent in the onboarding flow", "score": 1},
   {"id": "c", "text": "% of new users who reach the activation event (core value moment) within 7 days", "score": 4},
   {"id": "d", "text": "NPS score collected at the end of onboarding", "score": 2}
 ]'::jsonb
);

-- ─── User Empathy (Q9–Q10) ───────────────────────────────────────────────────

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'You are running a user interview to understand why customers churn. The user says "the product is just too complicated." What do you do next?',
 '[
   {"id": "a", "text": "Thank them and log the feedback as the churn reason without digging deeper", "score": 1},
   {"id": "b", "text": "Ask follow-up questions: which specific part felt complicated, walk me through the last time you used it, what were you trying to accomplish?", "score": 4},
   {"id": "c", "text": "Show them a prototype of a simpler UI and ask if that would help", "score": 2},
   {"id": "d", "text": "Inform them about existing documentation and help resources", "score": 1}
 ]'::jsonb
);

INSERT INTO assessment_questions (assessment_id, text, options) VALUES
(assessment_id,
 'Your analytics show that 80% of users never use a feature you spent 3 months building. How do you interpret this?',
 '[
   {"id": "a", "text": "The feature needs better marketing and in-app promotion", "score": 2},
   {"id": "b", "text": "Users do not understand the feature — improve the UI copy", "score": 2},
   {"id": "c", "text": "Conduct user research to determine whether this is a discovery problem, a value problem, or whether the feature solves a problem users do not actually have", "score": 4},
   {"id": "d", "text": "Deprecate the feature immediately since no one uses it", "score": 1}
 ]'::jsonb
);

END $$;
