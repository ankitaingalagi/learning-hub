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
    .select('*, roadmap_steps(*)')
    .eq('profile_id', profileId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function updateRoadmapStep(stepId, status) {
  return supabase.from('roadmap_steps').update({ status }).eq('id', stepId);
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
