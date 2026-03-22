-- Enable UUID extension
-- create extension if not exists "uuid-ossp";

-- Create Enums
create type user_role as enum ('learner', 'mentor', 'admin');
create type step_status as enum ('pending', 'in_progress', 'completed');
create type enrollment_status as enum ('active', 'completed');
create type progress_status as enum ('not_started', 'in_progress', 'completed');
create type session_status as enum ('scheduled', 'completed', 'canceled');

-- 1. Profiles
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role user_role not null default 'learner',
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;

-- 2. Waitlist
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);
alter table waitlist enable row level security;

-- 3. PM Archetypes
create table pm_archetypes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);
alter table pm_archetypes enable row level security;

-- 4. Archetype Results
create table archetype_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  archetype_id uuid references pm_archetypes(id) on delete cascade not null,
  created_at timestamptz default now()
);
alter table archetype_results enable row level security;

-- 5. Assessments
create table assessments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz default now()
);
alter table assessments enable row level security;

-- 6. Assessment Questions
create table assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments(id) on delete cascade not null,
  text text not null,
  options jsonb not null,
  created_at timestamptz default now()
);
alter table assessment_questions enable row level security;

-- 7. Assessment Results
create table assessment_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  assessment_id uuid references assessments(id) on delete cascade not null,
  score integer,
  created_at timestamptz default now()
);
alter table assessment_results enable row level security;

-- 8. Gap Analysis
create table gap_analysis (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  result_json jsonb,
  created_at timestamptz default now()
);
alter table gap_analysis enable row level security;

-- 9. Roadmaps
create table roadmaps (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  analysis_id uuid references gap_analysis(id) on delete set null,
  created_at timestamptz default now()
);
alter table roadmaps enable row level security;

-- 10. Roadmap Steps
create table roadmap_steps (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid references roadmaps(id) on delete cascade not null,
  title text not null,
  status step_status default 'pending',
  created_at timestamptz default now()
);
alter table roadmap_steps enable row level security;

-- 11. Programs
create table programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz default now()
);
alter table programs enable row level security;

-- 12. Modules
create table modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade not null,
  title text not null,
  order_index integer,
  created_at timestamptz default now()
);
alter table modules enable row level security;

-- 13. Lessons
create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  content text,
  created_at timestamptz default now()
);
alter table lessons enable row level security;

-- 14. Enrollments
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  program_id uuid references programs(id) on delete cascade not null,
  status enrollment_status default 'active',
  created_at timestamptz default now()
);
alter table enrollments enable row level security;

-- 15. Progress
create table progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  status progress_status default 'not_started',
  created_at timestamptz default now()
);
alter table progress enable row level security;

-- 16. Mentors
create table mentors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  bio text,
  expertise text[],
  created_at timestamptz default now()
);
alter table mentors enable row level security;

-- 17. Mentor Sessions
create table mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references mentors(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status session_status default 'scheduled',
  created_at timestamptz default now()
);
alter table mentor_sessions enable row level security;

-- 18. Events
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_time timestamptz not null,
  url text,
  created_at timestamptz default now()
);
alter table events enable row level security;

-- 19. Event Registrations
create table event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now()
);
alter table event_registrations enable row level security;

-- 20. Blog Posts
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);
alter table blog_posts enable row level security;

-- 21. Testimonials
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now()
);
alter table testimonials enable row level security;

-- 22. FAQs
create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);
alter table faqs enable row level security;

-- Enable Public Read Access Policies (High-Level)
create policy "Public read access for programs" on programs for select to anon, authenticated using (true);
create policy "Public read access for modules" on modules for select to anon, authenticated using (true);
create policy "Public read access for lessons" on lessons for select to anon, authenticated using (true);
create policy "Public read access for pm_archetypes" on pm_archetypes for select to anon, authenticated using (true);
create policy "Public read access for assessments" on assessments for select to anon, authenticated using (true);
create policy "Public read access for assessment_questions" on assessment_questions for select to anon, authenticated using (true);
create policy "Public read access for mentors" on mentors for select to anon, authenticated using (true);
create policy "Public read access for events" on events for select to anon, authenticated using (true);
create policy "Public read access for blog_posts" on blog_posts for select to anon, authenticated using (true);
create policy "Public read access for testimonials" on testimonials for select to anon, authenticated using (true);
create policy "Public read access for faqs" on faqs for select to anon, authenticated using (true);
create policy "Anyone can insert to waitlist" on waitlist for insert to anon, authenticated with check (true);

-- User-Specific Read/Write Policies
create policy "Users can read own profile" on profiles for select to authenticated using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update to authenticated using (auth.uid() = id);
create policy "Users can read own archetype results" on archetype_results for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own assessment results" on assessment_results for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own gap analysis" on gap_analysis for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own roadmaps" on roadmaps for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own enrollments" on enrollments for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own progress" on progress for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own event registrations" on event_registrations for select to authenticated using (auth.uid() = profile_id);
create policy "Users can read own mentor sessions" on mentor_sessions for select to authenticated using (auth.uid() = user_id);

-- Profile Trigger on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
