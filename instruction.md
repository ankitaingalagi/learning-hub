# Project: PM/Mentor Learning Management System
**Stack**: React + Vite (frontend, deployed on Vercel), Python FastAPI (backend, deployed on Railway), Supabase (PostgreSQL + Auth + Storage), Claude AI via Anthropic API for gap analysis and roadmap generation.

**Supabase schema**: profiles, pm_archetypes, archetype_results, programs, modules, lessons, assessments, assessment_questions, enrollments, progress, assessment_results, gap_analysis, roadmaps, roadmap_steps, mentors, mentor_sessions, events, event_registrations, blog_posts, testimonials, faqs, waitlist.

**Auth**: Supabase Auth handles email/password and social OAuth. JWTs are validated in FastAPI middleware. Roles are learner, mentor, admin stored in profiles.role. Row-Level Security (RLS) is enabled on all Supabase tables.

**AI integration**: Claude claude-sonnet-4-6 via Anthropic API. Prompt context includes learner profile, archetype result, and assessment scores. Outputs are structured JSON written to gap_analysis and roadmaps tables.

**MCP integrations**: Google Calendar MCP for mentor session booking, Gmail MCP for transactional emails, GitHub MCP for case study content pipeline.

**Coding conventions**: FastAPI routes follow RESTful resource naming. Pydantic models for all request/response schemas. React components are functional with hooks. No class components. Zustand for global state. All Supabase queries go through `services/supabase.js` — never call Supabase directly from components.

**Environment variables**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `VITE_API_BASE_URL`. Never hardcode these.

**When building a new feature**: 
1. Create the Supabase migration SQL.
2. Add the FastAPI route + Pydantic schema.
3. Add the React page or component.
4. Update target docs if the data model changes.
