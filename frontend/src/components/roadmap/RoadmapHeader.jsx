import { Trophy, RefreshCw } from 'lucide-react';

function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function MiniRing({ score, size = 48 }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color }}>{score}</span>
      </div>
    </div>
  );
}

export default function RoadmapHeader({ archetype, readiness, steps, onRegenerate, regenerating }) {
  const completed = steps.filter((s) => s.status === 'completed').length;
  const total = steps.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Archetype + readiness */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 auto', minWidth: '200px' }}>
          <MiniRing score={readiness} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Trophy size={14} color="var(--accent-violet)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-violet)', fontWeight: 600 }}>{archetype}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Learning Roadmap</h2>
          </div>
        </div>

        {/* Progress */}
        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {completed} of {total} steps completed
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: scoreColor(pct) }}>{pct}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, var(--accent-electric), var(--accent-violet))',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>

        {/* Regenerate */}
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="btn-outline"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px',
              opacity: regenerating ? 0.6 : 1,
            }}
          >
            <RefreshCw size={14} style={{ animation: regenerating ? 'spin 1s linear infinite' : 'none' }} />
            {regenerating ? 'Generating...' : 'Regenerate'}
          </button>
        )}
      </div>
    </div>
  );
}
