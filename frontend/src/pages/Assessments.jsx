import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getAssessmentResults } from '../services/supabase';
import { ClipboardList, ArrowRight, Clock, Award, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// ─── Skeleton card shown while loading ───────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="glass-panel"
      style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 1, transform: 'none' }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
        .sk { background: var(--glass-border); border-radius: 6px; animation: shimmer 1.4s ease-in-out infinite; }
      `}</style>

      {/* Icon + badge row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="sk" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
        <div className="sk" style={{ width: '80px', height: '22px' }} />
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="sk" style={{ width: '70%', height: '18px' }} />
        <div className="sk" style={{ width: '100%', height: '13px' }} />
        <div className="sk" style={{ width: '85%', height: '13px' }} />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div className="sk" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
        <div className="sk" style={{ width: '60px', height: '22px', borderRadius: '9999px' }} />
      </div>

      {/* Button */}
      <div className="sk" style={{ width: '100%', height: '40px', borderRadius: '8px', marginTop: 'auto' }} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Assessments() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // assessments: [{ id, title, description, question_count }]
  const [assessments, setAssessments] = useState([]);
  // results: { assessment_id → { score, max_score } }
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch assessments from FastAPI backend
        const res = await fetch(`${API}/api/assessments/`);
        if (!res.ok) throw new Error(`Failed to fetch assessments (${res.status})`);
        const data = await res.json();

        // 2. Fetch question count for each assessment in parallel
        //    (used for estimated time + max score calculation)
        const withCounts = await Promise.all(
          data.map(async (assessment) => {
            try {
              const qRes = await fetch(`${API}/api/assessments/${assessment.id}/questions`);
              const questions = qRes.ok ? await qRes.json() : [];
              return { ...assessment, question_count: questions.length };
            } catch {
              return { ...assessment, question_count: 0 };
            }
          })
        );
        setAssessments(withCounts);

        // 3. Fetch previous results — isolated so a Supabase failure won't
        //    block the assessment cards from rendering
        if (user?.id) {
          try {
            const resultRes = await getAssessmentResults(user.id);
            const map = {};
            (resultRes.data || []).forEach((r) => {
              const matched = withCounts.find((a) => a.id === r.assessment_id);
              map[r.assessment_id] = {
                score: r.score,
                max_score: (matched?.question_count || 0) * 4,
              };
            });
            setResults(map);
          } catch {
            // Results failing is non-fatal — cards still render without scores
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load assessments.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Assessments</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Complete assessments to identify your skill gaps and generate a personalized roadmap.
      </p>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171',
        }}>
          {error}
        </div>
      )}

      {/* Loading: 3 skeleton cards */}
      {loading && (
        <div className="grid-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && assessments.length === 0 && (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <ClipboardList size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No assessments available yet.</p>
        </div>
      )}

      {/* Assessment cards */}
      {!loading && assessments.length > 0 && (
        <div className="grid-2">
          {assessments.map((assessment) => {
            const result = results[assessment.id];
            const completed = result !== undefined;
            const estimatedMins = assessment.question_count > 0
              ? `~${assessment.question_count} min`
              : '~10 min';
            const maxScore = assessment.question_count * 4;

            return (
              <div
                key={assessment.id}
                className="glass-panel"
                style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 1, transform: 'none' }}
              >
                {/* Icon row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(139,92,246,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-violet)',
                  }}>
                    <ClipboardList size={20} />
                  </div>

                  {completed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} color="#fb923c" />
                      <span className="badge badge-orange">
                        Last score: {result.score}/{maxScore}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title + description */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                    {assessment.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {assessment.description || 'No description available.'}
                  </p>
                </div>

                {/* Meta pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    className="badge badge-gray"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Clock size={11} />
                    {estimatedMins}
                  </span>
                  {assessment.question_count > 0 && (
                    <span className="badge badge-blue">
                      {assessment.question_count} questions
                    </span>
                  )}
                  {completed && (
                    <span className="badge badge-green">Completed</span>
                  )}
                </div>

                {/* CTA button */}
                <button
                  className={completed ? 'btn-outline' : 'btn-primary'}
                  onClick={() => navigate(`/app/assessments/${assessment.id}/take`)}
                  style={{
                    borderRadius: '8px', padding: '11px', fontSize: '0.875rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', marginTop: 'auto',
                  }}
                >
                  {completed ? <RefreshCw size={14} /> : <ArrowRight size={14} />}
                  {completed ? 'Retake Assessment' : 'Start Assessment'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
