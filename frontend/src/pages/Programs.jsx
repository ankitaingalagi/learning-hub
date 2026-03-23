import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getPrograms, getEnrollments, enrollInProgram } from '../services/supabase';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

export default function Programs() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [enrolling, setEnrolling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [progRes, enrollRes] = await Promise.all([
          getPrograms(),
          getEnrollments(user.id),
        ]);
        if (progRes.error) throw progRes.error;
        setPrograms(progRes.data || []);
        setEnrolledIds(new Set((enrollRes.data || []).map(e => e.program_id)));
      } catch (err) {
        setError('Failed to load programs.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleEnroll = async (e, programId) => {
    e.stopPropagation();
    setEnrolling(programId);
    try {
      const { error: enrollError } = await enrollInProgram(user.id, programId);
      if (enrollError) throw enrollError;
      setEnrolledIds(prev => new Set([...prev, programId]));
    } catch (err) {
      alert(err.message || 'Enrollment failed.');
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading programs...</div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Programs</h1>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {programs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No programs available yet.</p>
        </div>
      ) : (
        <div className="grid-2">
          {programs.map(program => {
            const enrolled = enrolledIds.has(program.id);
            return (
              <div key={program.id} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-electric)', flexShrink: 0 }}>
                    <BookOpen size={20} />
                  </div>
                  {enrolled && (
                    <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} /> Enrolled
                    </span>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{program.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {program.description || 'No description available.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/app/programs/${program.id}`)}
                    style={{ flex: 1, borderRadius: '8px', padding: '10px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    View Course <ArrowRight size={14} />
                  </button>
                  {!enrolled && (
                    <button
                      className="btn-outline"
                      onClick={e => handleEnroll(e, program.id)}
                      disabled={enrolling === program.id}
                      style={{ borderRadius: '8px', padding: '10px 16px', fontSize: '0.875rem', opacity: enrolling === program.id ? 0.7 : 1 }}
                    >
                      {enrolling === program.id ? '...' : 'Enroll'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
