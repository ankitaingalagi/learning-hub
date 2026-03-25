import { FileText } from 'lucide-react';

function MiniRing({ percentage, size = 48 }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? '#4ade80' : percentage >= 50 ? '#fbbf24' : '#f87171';

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
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color }}>{percentage}%</span>
      </div>
    </div>
  );
}

export default function ResumeAnalysisBadge({ resumeSkills }) {
  if (!resumeSkills) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(59,130,246,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <FileText size={18} color="var(--accent-electric)" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Resume Skills Match</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Extracted from your uploaded resume
          </p>
        </div>
        <MiniRing percentage={resumeSkills.match_percentage} />
      </div>

      {/* Skill chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {resumeSkills.extracted.map((skill) => (
          <span
            key={skill}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              background: 'rgba(139,92,246,0.1)',
              color: 'var(--accent-violet)',
              fontSize: '0.78rem',
              fontWeight: 500,
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
