import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Award, RotateCcw, ChevronRight, TrendingUp } from 'lucide-react';

const BAND_COLORS = [
  { bar: 'var(--accent-electric)', bg: 'rgba(59,130,246,0.12)' },
  { bar: 'var(--accent-violet)',   bg: 'rgba(139,92,246,0.12)' },
  { bar: '#34d399',                bg: 'rgba(52,211,153,0.12)' },
  { bar: '#fb923c',                bg: 'rgba(251,146,60,0.12)' },
  { bar: '#f472b6',                bg: 'rgba(244,114,182,0.12)' },
];

function CompetencyBar({ competency, score, max_score, percentage, colorIdx }) {
  const { bar, bg } = BAND_COLORS[colorIdx % BAND_COLORS.length];
  return (
    <div style={{ background: bg, borderRadius: '12px', padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{competency}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {score}/{max_score} &nbsp;<strong style={{ color: bar }}>{percentage}%</strong>
        </span>
      </div>
      <div style={{ height: '8px', background: 'var(--glass-border)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${percentage}%`,
          background: bar, borderRadius: '9999px',
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

function ScoreRing({ percentage }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--glass-border)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke="url(#ring-grad)" strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-electric)" />
            <stop offset="100%" stopColor="var(--accent-violet)" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{percentage}%</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>score</span>
      </div>
    </div>
  );
}

export default function AssessmentResults() {
  const { assessment_id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;

  if (!result) {
    return (
      <div className="page">
        <p style={{ color: '#f87171', marginBottom: '16px' }}>No results found. Please take the assessment first.</p>
        <button className="btn-outline" onClick={() => navigate('/app/assessments')}
          style={{ borderRadius: '8px', padding: '9px 20px', fontSize: '0.875rem' }}>
          ← Back to Assessments
        </button>
      </div>
    );
  }

  const { total_score, max_possible_score, percentage, competency_breakdown } = result;

  const label =
    percentage >= 80 ? 'Excellent' :
    percentage >= 60 ? 'Good' :
    percentage >= 40 ? 'Developing' : 'Needs Work';

  const labelColor =
    percentage >= 80 ? '#34d399' :
    percentage >= 60 ? 'var(--accent-electric)' :
    percentage >= 40 ? '#fb923c' : '#f87171';

  return (
    <div className="page animate-fade-in" style={{ opacity: 1, maxWidth: '700px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Award size={22} color="var(--accent-violet)" />
        <h1 className="page-title" style={{ margin: 0 }}>Assessment Complete</h1>
      </div>

      {/* Score summary card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', opacity: 1, transform: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <ScoreRing percentage={percentage} />

          <div style={{ flex: 1, minWidth: '160px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }}>Overall Score</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>
              {total_score} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ {max_possible_score}</span>
            </p>
            <span style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '9999px',
              fontSize: '0.82rem', fontWeight: 700,
              background: `${labelColor}22`, color: labelColor,
            }}>
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Competency breakdown */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px', opacity: 1, transform: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <TrendingUp size={18} color="var(--accent-electric)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Competency Breakdown</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(competency_breakdown || []).map((item, idx) => (
            <CompetencyBar key={item.competency} {...item} colorIdx={idx} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          className="btn-outline"
          onClick={() => navigate(`/app/assessments/${assessment_id}/take`)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', padding: '11px 20px', fontSize: '0.875rem' }}
        >
          <RotateCcw size={14} /> Retake Assessment
        </button>
        <button
          className="btn-primary"
          onClick={() => navigate('/app/gap-analysis')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', padding: '11px 24px', fontSize: '0.875rem' }}
        >
          View Gap Analysis <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
