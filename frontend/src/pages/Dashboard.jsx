import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getAllProgress, getRoadmap, getMentorSessions } from '../services/supabase';
import { BookOpen, CheckCircle, Calendar, ArrowRight } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'badge-gray',
  in_progress: 'badge-orange',
  completed: 'badge-green',
};

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const [completedLessons, setCompletedLessons] = useState(0);
  const [roadmap, setRoadmap] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [progressRes, roadmapRes, sessionRes] = await Promise.all([
          getAllProgress(user.id),
          getRoadmap(user.id),
          getMentorSessions(user.id),
        ]);
        setCompletedLessons((progressRes.data || []).filter(p => p.status === 'completed').length);
        setRoadmap(roadmapRes.data || null);
        setSessions((sessionRes.data || []).filter(s => new Date(s.start_time) >= new Date()));
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</div>
      </div>
    );
  }

  const roadmapSteps = roadmap?.roadmap_steps || [];
  const nextSession = sessions[0];

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Welcome back, <span className="text-gradient">{profile?.full_name || 'Learner'}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's a snapshot of your learning progress.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid-2" style={{ marginBottom: '40px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{completedLessons}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed Lessons</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)' }}>
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{sessions.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upcoming Sessions</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Right column: Roadmap + Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Roadmap snippet */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>My Roadmap</h2>
              <Link to="/app/roadmap" style={{ color: 'var(--accent-electric)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {roadmapSteps.length === 0 ? (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
                <p style={{ marginBottom: '8px' }}>No roadmap yet.</p>
                <Link to="/app/assessments" style={{ color: 'var(--accent-electric)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                  Take an assessment →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {roadmapSteps.slice(0, 3).map(step => (
                  <div key={step.id} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 1, transform: 'none' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{step.title}</span>
                    <span className={`badge ${STATUS_COLORS[step.status] || 'badge-gray'}`}>{step.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming session */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Upcoming Session</h2>
            {nextSession ? (
              <div className="glass-panel" style={{ padding: '20px', opacity: 1, transform: 'none' }}>
                <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                  with {nextSession.mentors?.profiles?.full_name || 'Mentor'}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(nextSession.start_time).toLocaleString()}
                </div>
                <span className={`badge badge-blue`} style={{ marginTop: '10px', display: 'inline-block' }}>{nextSession.status}</span>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
                <p style={{ marginBottom: '8px' }}>No upcoming sessions.</p>
                <Link to="/app/mentors" style={{ color: 'var(--accent-electric)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                  Book a mentor →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
