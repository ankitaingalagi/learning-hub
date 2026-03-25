import { Link } from 'react-router-dom';
import { PartyPopper, RotateCcw } from 'lucide-react';

export default function CompletionCard() {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(59,130,246,0.06))',
        borderColor: 'rgba(74,222,128,0.25)',
        opacity: 1,
        transform: 'none',
      }}
    >
      <div
        style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(74,222,128,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <PartyPopper size={32} color="#4ade80" />
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
        Roadmap Complete!
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 24px' }}>
        You've completed all steps in your learning roadmap. Retake the assessment to measure your improvement and generate a new roadmap.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/app/assessments">
          <button className="btn-primary" style={{ borderRadius: '10px', padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={16} />
            Retake Assessment
          </button>
        </Link>
        <Link to="/app/gap-analysis">
          <button className="btn-outline" style={{ borderRadius: '10px', padding: '12px 28px' }}>
            View Gap Analysis
          </button>
        </Link>
      </div>
    </div>
  );
}
