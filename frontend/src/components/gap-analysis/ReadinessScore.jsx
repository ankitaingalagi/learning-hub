function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function ScoreRing({ score, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Readiness</span>
      </div>
    </div>
  );
}

function SubScoreBar({ label, score }) {
  const color = scoreColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '160px', flexShrink: 0 }}>
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            borderRadius: '4px',
            background: color,
            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color, width: '32px', textAlign: 'right' }}>
        {score}
      </span>
    </div>
  );
}

const SUB_SCORE_LABELS = {
  strategic_thinking: 'Strategic Thinking',
  technical_proficiency: 'Technical Proficiency',
  execution_delivery: 'Execution & Delivery',
};

export default function ReadinessScore({ readiness }) {
  if (!readiness) return null;

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>Readiness Score</h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        {/* Ring */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ScoreRing score={readiness.overall} />
        </div>

        {/* Sub-scores */}
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(readiness.sub_scores).map(([key, value]) => (
            <SubScoreBar key={key} label={SUB_SCORE_LABELS[key] || key} score={value} />
          ))}
        </div>
      </div>
    </div>
  );
}
