import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GenerateRoadmap({ hasAnalysis, onGenerate, generating }) {
  // No gap analysis yet
  if (!hasAnalysis) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', opacity: 1, transform: 'none' }}>
        <Sparkles size={56} style={{ marginBottom: '20px', opacity: 0.3, color: 'var(--accent-violet)' }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>No roadmap yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
          Complete a gap analysis first, then we'll generate a personalized learning roadmap for you.
        </p>
        <Link to="/app/gap-analysis">
          <button className="btn-primary" style={{ borderRadius: '10px', padding: '12px 28px' }}>
            View Gap Analysis
          </button>
        </Link>
      </div>
    );
  }

  // Has analysis but no roadmap — show generate button
  return (
    <div
      className="glass-panel"
      style={{
        padding: '60px',
        textAlign: 'center',
        opacity: 1,
        transform: 'none',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))',
        borderColor: 'rgba(139,92,246,0.2)',
      }}
    >
      <div
        style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <Sparkles size={32} color="#fff" />
      </div>

      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
        Your Gap Analysis is Ready
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 28px' }}>
        AI will create a step-by-step learning plan tailored to close your skill gaps and accelerate your PM career.
      </p>

      <button
        onClick={onGenerate}
        disabled={generating}
        className="btn-primary"
        style={{
          borderRadius: '10px',
          padding: '14px 32px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          opacity: generating ? 0.7 : 1,
        }}
      >
        {generating ? (
          <>
            <span className="loading-pulse">Generating your roadmap...</span>
          </>
        ) : (
          <>
            Generate My Roadmap
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
