import { Brain, Cpu, Rocket } from 'lucide-react';

const DIMENSION_ICONS = {
  'Strategic Thinking': Brain,
  'Technical Proficiency': Cpu,
  'Execution & Delivery': Rocket,
};

function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function MiniScoreRing({ score, maxScore, size = 56 }) {
  const pct = (score / maxScore) * 100;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = scoreColor(pct);

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
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{score}</span>
      </div>
    </div>
  );
}

export default function FitmentScoreCards({ fitmentScores }) {
  if (!fitmentScores?.length) return null;

  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Assessment Fitment</h3>
      <div className="grid-3">
        {fitmentScores.map((f, i) => {
          const Icon = DIMENSION_ICONS[f.dimension] || Brain;
          const pct = (f.score / f.max_score) * 100;
          const color = scoreColor(pct);

          return (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: `${color}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{f.dimension}</h4>
                </div>
                <MiniScoreRing score={f.score} maxScore={f.max_score} />
              </div>

              {/* Basis text */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.basis}
              </p>

              {/* Footer */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                Based on {f.questions_evaluated} questions
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
