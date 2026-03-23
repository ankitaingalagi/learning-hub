import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getRoadmap, updateRoadmapStep } from '../services/supabase';
import { Map, CheckCircle, Circle, Loader } from 'lucide-react';

const STATUS_ORDER = ['pending', 'in_progress', 'completed'];
const BADGE_CLASS = { pending: 'badge-gray', in_progress: 'badge-orange', completed: 'badge-green' };
const STATUS_ICONS = {
  pending: Circle,
  in_progress: Loader,
  completed: CheckCircle,
};
const STATUS_COLORS = {
  pending: 'var(--text-secondary)',
  in_progress: '#fb923c',
  completed: '#4ade80',
};

export default function Roadmap() {
  const { user } = useAuthStore();
  const [roadmap, setRoadmap] = useState(null);
  const [steps, setSteps] = useState([]);
  const [updating, setUpdating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getRoadmap(user.id);
        if (fetchError) throw fetchError;
        setRoadmap(data);
        setSteps(data?.roadmap_steps || []);
      } catch (err) {
        setError('Failed to load roadmap.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleCycleStatus = async (step) => {
    const currentIdx = STATUS_ORDER.indexOf(step.status);
    const nextStatus = STATUS_ORDER[(currentIdx + 1) % STATUS_ORDER.length];
    setUpdating(step.id);
    try {
      const { error: updateError } = await updateRoadmapStep(step.id, nextStatus);
      if (updateError) throw updateError;
      setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: nextStatus } : s));
    } catch (err) {
      alert('Failed to update step status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading roadmap...</div>
      </div>
    );
  }

  if (error) {
    return <div className="page"><div style={{ color: '#f87171' }}>{error}</div></div>;
  }

  if (!roadmap || steps.length === 0) {
    return (
      <div className="page animate-fade-in" style={{ opacity: 1 }}>
        <h1 className="page-title">My Roadmap</h1>
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', opacity: 1, transform: 'none' }}>
          <Map size={56} style={{ marginBottom: '20px', opacity: 0.3, color: 'var(--accent-violet)' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>No roadmap yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
            Complete a gap analysis to generate your personalized learning roadmap.
          </p>
          <Link to="/app/gap-analysis">
            <button className="btn-primary" style={{ borderRadius: '10px', padding: '12px 28px' }}>
              View Gap Analysis
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>My Roadmap</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {completedCount} of {steps.length} steps completed
        </p>
        {/* Progress bar */}
        <div style={{ height: '8px', background: 'var(--glass-bg)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--glass-border)', maxWidth: '400px' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{progressPct}% complete</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: '27px', top: '0', bottom: '0', width: '2px', background: 'var(--glass-border)', zIndex: 0 }} />

        {steps.map((step, idx) => {
          const Icon = STATUS_ICONS[step.status] || Circle;
          const iconColor = STATUS_COLORS[step.status] || 'var(--text-secondary)';
          const isUpdating = updating === step.id;

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', zIndex: 1 }}>
              {/* Icon */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--bg-primary)', border: `2px solid ${iconColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor,
              }}>
                <Icon size={16} />
              </div>

              {/* Card */}
              <div className="glass-panel" style={{ flex: 1, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', opacity: 1, transform: 'none' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{step.title}</div>
                  <span className={`badge ${BADGE_CLASS[step.status] || 'badge-gray'}`}>{step.status.replace('_', ' ')}</span>
                </div>
                <button
                  onClick={() => handleCycleStatus(step)}
                  disabled={isUpdating}
                  className="btn-outline"
                  style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '0.78rem', whiteSpace: 'nowrap', opacity: isUpdating ? 0.6 : 1 }}
                >
                  {isUpdating ? '...' : step.status === 'completed' ? 'Reset' : step.status === 'in_progress' ? 'Mark Done' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
