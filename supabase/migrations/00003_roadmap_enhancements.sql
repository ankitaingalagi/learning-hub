-- ============================================================================
-- 00003_roadmap_enhancements.sql
-- Adds: phase system, task metadata, readiness scoring, rewards, submissions
-- ============================================================================

-- Enums
CREATE TYPE step_type AS ENUM ('video', 'reading', 'practice', 'project');
CREATE TYPE reward_status AS ENUM ('locked', 'unclaimed', 'claimed');
CREATE TYPE submission_status AS ENUM ('pending_review', 'reviewed');

-- Extend roadmaps with live readiness score
ALTER TABLE roadmaps
  ADD COLUMN readiness_score integer DEFAULT 0;

-- Extend roadmap_steps with phase, type, metadata
ALTER TABLE roadmap_steps
  ADD COLUMN phase_number integer NOT NULL DEFAULT 1,
  ADD COLUMN step_type step_type DEFAULT 'reading',
  ADD COLUMN time_estimate_minutes integer,
  ADD COLUMN resource_url text,
  ADD COLUMN points integer DEFAULT 10,
  ADD COLUMN is_submission_required boolean DEFAULT false,
  ADD COLUMN mentor_id uuid REFERENCES mentors(id) ON DELETE SET NULL;

CREATE INDEX idx_roadmap_steps_phase ON roadmap_steps (roadmap_id, phase_number, order_index);

-- Roadmap Phases (metadata + rewards per phase)
CREATE TABLE roadmap_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid REFERENCES roadmaps(id) ON DELETE CASCADE NOT NULL,
  phase_number integer NOT NULL,
  title text NOT NULL,
  subtitle text,
  reward_title text,
  reward_description text,
  reward_status reward_status DEFAULT 'locked',
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (roadmap_id, phase_number)
);
ALTER TABLE roadmap_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roadmap phases"
  ON roadmap_phases FOR SELECT TO authenticated
  USING (roadmap_id IN (SELECT id FROM roadmaps WHERE profile_id = auth.uid()));

CREATE POLICY "Users can update own roadmap phases"
  ON roadmap_phases FOR UPDATE TO authenticated
  USING (roadmap_id IN (SELECT id FROM roadmaps WHERE profile_id = auth.uid()));

-- Roadmap Submissions (file upload + AI feedback)
CREATE TABLE roadmap_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id uuid REFERENCES roadmap_steps(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_url text NOT NULL,
  file_name text,
  status submission_status DEFAULT 'pending_review',
  ai_feedback jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE roadmap_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own submissions"
  ON roadmap_submissions FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own submissions"
  ON roadmap_submissions FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- RLS: allow users to update steps on their own roadmaps
CREATE POLICY "Users can update own roadmap steps"
  ON roadmap_steps FOR UPDATE TO authenticated
  USING (roadmap_id IN (SELECT id FROM roadmaps WHERE profile_id = auth.uid()));

-- RLS: allow users to update own roadmaps (readiness_score)
CREATE POLICY "Users can update own roadmaps"
  ON roadmaps FOR UPDATE TO authenticated
  USING (profile_id = auth.uid());

-- NOTE: Create Supabase Storage bucket 'submissions' via dashboard:
--   supabase storage create submissions --public=false
