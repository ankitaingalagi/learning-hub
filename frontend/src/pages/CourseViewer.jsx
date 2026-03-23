import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getProgram, getAllProgress } from '../services/supabase';
import { ChevronLeft, ChevronDown, ChevronRight, CheckCircle, Circle, PlayCircle } from 'lucide-react';

export default function CourseViewer() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [progress, setProgress] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [progRes, progressRes] = await Promise.all([
          getProgram(id),
          getAllProgress(user.id),
        ]);
        if (progRes.error) throw progRes.error;
        setProgram(progRes.data);

        // Build progress map: lesson_id → status
        const map = {};
        (progressRes.data || []).forEach(p => { map[p.lesson_id] = p.status; });
        setProgress(map);

        // Expand first module by default
        if (progRes.data?.modules?.length > 0) {
          setExpandedModules({ [progRes.data.modules[0].id]: true });
        }
      } catch (err) {
        setError('Failed to load program.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, id]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const getStatusIcon = (lessonId) => {
    const status = progress[lessonId];
    if (status === 'completed') return <CheckCircle size={16} color="#4ade80" />;
    if (status === 'in_progress') return <PlayCircle size={16} color="var(--accent-electric)" />;
    return <Circle size={16} color="var(--text-secondary)" />;
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading course...</div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="page">
        <div style={{ color: '#f87171' }}>{error || 'Program not found.'}</div>
        <button className="btn-outline" onClick={() => navigate('/app/programs')} style={{ marginTop: '16px' }}>
          Back to Programs
        </button>
      </div>
    );
  }

  const sortedModules = [...(program.modules || [])].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      {/* Back button */}
      <button
        className="btn-outline"
        onClick={() => navigate('/app/programs')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
      >
        <ChevronLeft size={16} /> Back to Programs
      </button>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>{program.title}</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{program.description}</p>
      </div>

      {/* Modules accordion */}
      {sortedModules.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          No modules available yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedModules.map((module, idx) => {
            const isExpanded = expandedModules[module.id];
            const lessons = [...(module.lessons || [])].sort((a, b) => (a.id > b.id ? 1 : -1));
            const completedCount = lessons.filter(l => progress[l.id] === 'completed').length;

            return (
              <div key={module.id} className="glass-panel" style={{ overflow: 'hidden', opacity: 1, transform: 'none' }}>
                {/* Module header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      background: 'rgba(59,130,246,0.1)', color: 'var(--accent-electric)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem',
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{module.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {completedCount}/{lessons.length} lessons completed
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown size={18} color="var(--text-secondary)" /> : <ChevronRight size={18} color="var(--text-secondary)" />}
                </button>

                {/* Lessons list */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--glass-border)' }}>
                    {lessons.length === 0 ? (
                      <div style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No lessons yet.</div>
                    ) : (
                      lessons.map((lesson, lIdx) => (
                        <Link
                          key={lesson.id}
                          to={`/app/programs/${id}/lessons/${lesson.id}`}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 24px', textDecoration: 'none', color: 'var(--text-primary)',
                            borderBottom: lIdx < lessons.length - 1 ? '1px solid var(--glass-border)' : 'none',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {getStatusIcon(lesson.id)}
                            <span style={{ fontSize: '0.9rem' }}>{lesson.title}</span>
                          </div>
                          <ChevronRight size={14} color="var(--text-secondary)" />
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
