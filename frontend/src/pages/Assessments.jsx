import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getAssessments, getAssessmentResults } from '../services/supabase';
import { ClipboardList, ArrowRight, Award } from 'lucide-react';

export default function Assessments() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const assessRes = await getAssessments();
        if (assessRes.error) throw assessRes.error;
        setAssessments(assessRes.data || []);

        // Only fetch results if a user is logged in
        if (user?.id) {
          const resultRes = await getAssessmentResults(user.id);
          const map = {};
          (resultRes.data || []).forEach(r => { map[r.assessment_id] = r.score; });
          setResults(map);
        }
      } catch (err) {
        setError('Failed to load assessments.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading assessments...</div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Assessments</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Complete assessments to identify your skill gaps and generate a personalized roadmap.
      </p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {assessments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <ClipboardList size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No assessments available yet.</p>
        </div>
      ) : (
        <div className="grid-2">
          {assessments.map(assessment => {
            const score = results[assessment.id];
            const completed = score !== undefined;
            return (
              <div key={assessment.id} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)' }}>
                    <ClipboardList size={20} />
                  </div>
                  {completed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} color="#fb923c" />
                      <span className="badge badge-orange">Score: {score}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{assessment.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {assessment.description || 'No description available.'}
                  </p>
                </div>

                <button
                  className={completed ? 'btn-outline' : 'btn-primary'}
                  onClick={() => navigate(`/app/assessments/${assessment.id}`)}
                  style={{ borderRadius: '8px', padding: '10px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: 'auto' }}
                >
                  {completed ? 'Retake Assessment' : 'Start Assessment'}
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
