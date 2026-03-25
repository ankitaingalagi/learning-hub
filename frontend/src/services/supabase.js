import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signUp(email, password, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function getProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

// ─── Programs ────────────────────────────────────────────────────────────────

export async function getPrograms() {
  return supabase.from('programs').select('*').order('created_at', { ascending: false });
}

export async function getProgram(id) {
  return supabase
    .from('programs')
    .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
    .eq('id', id)
    .single();
}

export async function enrollInProgram(profileId, programId) {
  return supabase.from('enrollments').insert({ profile_id: profileId, program_id: programId, status: 'active' });
}

export async function getEnrollments(profileId) {
  return supabase
    .from('enrollments')
    .select('*, programs(*)')
    .eq('profile_id', profileId);
}

// ─── Progress ────────────────────────────────────────────────────────────────

export async function getLessonProgress(profileId, lessonId) {
  return supabase
    .from('progress')
    .select('*')
    .eq('profile_id', profileId)
    .eq('lesson_id', lessonId)
    .maybeSingle();
}

export async function upsertProgress(profileId, lessonId, status) {
  return supabase
    .from('progress')
    .upsert(
      { profile_id: profileId, lesson_id: lessonId, status },
      { onConflict: 'profile_id,lesson_id' }
    );
}

export async function getAllProgress(profileId) {
  return supabase.from('progress').select('*').eq('profile_id', profileId);
}

// ─── Assessments ─────────────────────────────────────────────────────────────

export async function getAssessments() {
  return supabase.from('assessments').select('*');
}

export async function getAssessmentWithQuestions(id) {
  return supabase
    .from('assessments')
    .select('*, assessment_questions(*)')
    .eq('id', id)
    .single();
}

export async function submitAssessmentResult(profileId, assessmentId, score) {
  return supabase
    .from('assessment_results')
    .insert({ profile_id: profileId, assessment_id: assessmentId, score });
}

export async function getAssessmentResults(profileId) {
  return supabase
    .from('assessment_results')
    .select('*, assessments(*)')
    .eq('profile_id', profileId);
}

// ─── AI / Gap Analysis / Roadmap ─────────────────────────────────────────────

export async function getGapAnalysis(profileId) {
  return supabase
    .from('gap_analysis')
    .select('*')
    .eq('profile_id', profileId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function getRoadmap(profileId) {
  return supabase
    .from('roadmaps')
    .select(`
      *,
      roadmap_steps(
        id, roadmap_id, title, description, skill_area, order_index, status,
        phase_number, step_type, time_estimate_minutes, resource_url, points,
        is_submission_required, mentor_id,
        mentors(id, profiles(full_name, avatar_url)),
        created_at
      ),
      roadmap_phases(*)
    `)
    .eq('profile_id', profileId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function updateRoadmapStep(stepId, status) {
  return supabase.from('roadmap_steps').update({ status }).eq('id', stepId);
}

// ─── Roadmap Phases ─────────────────────────────────────────────────────────

export async function getRoadmapPhases(roadmapId) {
  return supabase
    .from('roadmap_phases')
    .select('*')
    .eq('roadmap_id', roadmapId)
    .order('phase_number', { ascending: true });
}

export async function claimPhaseReward(phaseId) {
  return supabase
    .from('roadmap_phases')
    .update({ reward_status: 'claimed', claimed_at: new Date().toISOString() })
    .eq('id', phaseId);
}

// ─── Readiness Score ────────────────────────────────────────────────────────

export async function updateRoadmapReadiness(roadmapId, newScore) {
  return supabase
    .from('roadmaps')
    .update({ readiness_score: newScore })
    .eq('id', roadmapId);
}

// ─── Submissions ────────────────────────────────────────────────────────────

export async function getStepSubmission(stepId, profileId) {
  return supabase
    .from('roadmap_submissions')
    .select('*')
    .eq('step_id', stepId)
    .eq('profile_id', profileId)
    .maybeSingle();
}

export async function uploadSubmissionFile(stepId, profileId, file) {
  const path = `${profileId}/${stepId}/${file.name}`;
  const { data, error } = await supabase.storage
    .from('submissions')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return data;
}

export async function createSubmission(stepId, profileId, fileUrl, fileName) {
  return supabase
    .from('roadmap_submissions')
    .insert({ step_id: stepId, profile_id: profileId, file_url: fileUrl, file_name: fileName })
    .select()
    .single();
}

export async function requestAIFeedback(submissionId) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;

  const res = await fetch(`${apiBase}/api/roadmap/submissions/${submissionId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to get AI feedback');
  }
  return res.json();
}

export async function generateRoadmap(profileId) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;

  const res = await fetch(`${apiBase}/api/roadmap/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ profile_id: profileId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to generate roadmap');
  }
  return res.json();
}

// ─── Mentors ─────────────────────────────────────────────────────────────────

export async function getMentors() {
  return supabase
    .from('mentors')
    .select('*, profiles(full_name, avatar_url)');
}

export async function bookSession(mentorId, userId, startTime, endTime) {
  return supabase
    .from('mentor_sessions')
    .insert({ mentor_id: mentorId, user_id: userId, start_time: startTime, end_time: endTime, status: 'scheduled' });
}

export async function getMentorSessions(userId) {
  return supabase
    .from('mentor_sessions')
    .select('*, mentors(*, profiles(full_name))')
    .eq('user_id', userId)
    .order('start_time', { ascending: true });
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents() {
  return supabase.from('events').select('*').order('start_time', { ascending: true });
}

export async function registerForEvent(profileId, eventId) {
  return supabase
    .from('event_registrations')
    .insert({ profile_id: profileId, event_id: eventId });
}

export async function getMyEventRegistrations(profileId) {
  return supabase
    .from('event_registrations')
    .select('*')
    .eq('profile_id', profileId);
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts() {
  return supabase
    .from('blog_posts')
    .select('*, profiles(full_name)')
    .order('id', { ascending: false });
}

export async function getBlogPost(id) {
  return supabase
    .from('blog_posts')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single();
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function getAllProfiles() {
  // Note: RLS must allow this or use service role key for full access
  return supabase.from('profiles').select('*');
}

export async function createProgram(title, description) {
  return supabase.from('programs').insert({ title, description }).select().single();
}

export async function createModule(programId, title, orderIndex) {
  return supabase.from('modules').insert({ program_id: programId, title, order_index: orderIndex }).select().single();
}

export async function createLesson(moduleId, title, content) {
  return supabase.from('lessons').insert({ module_id: moduleId, title, content }).select().single();
}

export async function deleteProgram(id) {
  return supabase.from('programs').delete().eq('id', id);
}
