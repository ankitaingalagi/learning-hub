-- Extend roadmap_steps for AI-generated personalized roadmaps
-- Adds description, skill_area (maps to gap_profile skills), and order_index for display ordering

ALTER TABLE roadmap_steps
  ADD COLUMN description text,
  ADD COLUMN skill_area text,
  ADD COLUMN order_index integer DEFAULT 0;

-- Index for ordering steps within a roadmap
CREATE INDEX idx_roadmap_steps_order ON roadmap_steps (roadmap_id, order_index);

-- Index for grouping/filtering by skill area
CREATE INDEX idx_roadmap_steps_skill ON roadmap_steps (roadmap_id, skill_area);
