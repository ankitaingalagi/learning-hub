import { CheckCircle, Circle, Loader, AlertTriangle } from 'lucide-react';

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

const BUTTON_LABELS = {
  pending: 'Start',
  in_progress: 'Mark Done',
  completed: 'Reset',
};

const STATUS_ORDER = ['pending', 'in_progress', 'completed'];

export default function StepTimeline({ steps, gapProfile, activeSkill, onStatusChange, updatingId }) {
  if (!steps?.length) return null;

  // Filter by active skill
  const filtered = activeSkill ? steps.filter((s) => s.skill_area === activeSkill) : steps;

  // Sort by order_index
  const sorted = [...filtered].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  // Group by skill_area
  const groups = {};
  sorted.forEach((s) => {
    const area = s.skill_area || 'General';
    if (!groups[area]) groups[area] = [];
    groups[area].push(s);
  });

  // Gap lookup
  const gapMap = {};
  (gapProfile || []).forEach((g) => {
    gapMap[g.skill] = g;
  });

  // Order groups by gap severity
  const groupOrder = Object.keys(groups).sort((a, b) => {
    const gapA = gapMap[a] ? gapMap[a].required - gapMap[a].current : 0;
    const gapB = gapMap[b] ? gapMap[b].required - gapMap[b].current : 0;
    return gapB - gapA;
  });

  const cycleStatus = (step) => {
    const idx = STATUS_ORDER.indexOf(step.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    onStatusChange(step.id, next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {groupOrder.map((skillArea) => {
        const groupSteps = groups[skillArea];
        const gap = gapMap[skillArea];
        const groupCompleted = groupSteps.filter((s) => s.status === 'completed').length;

        return (
          <div key={skillArea}>
            {/* Group header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{skillArea}</h3>
              {gap && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={13} color="#fbbf24" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Current {gap.current} → Required {gap.required}
                  </span>
                </div>
              )}
              <span
                className="badge badge-blue"
                style={{ fontSize: '0.7rem', marginLeft: 'auto' }}
              >
                {groupCompleted}/{groupSteps.length}
              </span>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
              {/* Vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: '17px',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: 'var(--glass-border)',
                  zIndex: 0,
                }}
              />

              {groupSteps.map((step) => {
                const Icon = STATUS_ICONS[step.status] || Circle;
                const iconColor = STATUS_COLORS[step.status];
                const isUpdating = updatingId === step.id;

                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Status icon */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: 'var(--bg-primary)',
                        border: `2px solid ${iconColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: iconColor,
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    {/* Card */}
                    <div
                      className="glass-panel"
                      style={{
                        flex: 1,
                        padding: '18px 22px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px',
                        opacity: 1,
                        transform: 'none',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.95rem' }}>
                          {step.title}
                        </div>
                        {step.description && (
                          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
                            {step.description}
                          </p>
                        )}
                        <span
                          className={`badge ${
                            step.status === 'completed'
                              ? 'badge-green'
                              : step.status === 'in_progress'
                              ? 'badge-orange'
                              : 'badge-gray'
                          }`}
                        >
                          {step.status.replace('_', ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => cycleStatus(step)}
                        disabled={isUpdating}
                        className="btn-outline"
                        style={{
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                          opacity: isUpdating ? 0.6 : 1,
                          flexShrink: 0,
                          alignSelf: 'center',
                        }}
                      >
                        {isUpdating ? '...' : BUTTON_LABELS[step.status]}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
