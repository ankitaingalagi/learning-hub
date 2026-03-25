import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default function Assessments() {
  const navigate = useNavigate();

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Assessments</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Complete assessments to identify your skill gaps and generate a personalized roadmap.
      </p>

      {/* Featured Career Readiness Card */}
      <div 
        className="glass-panel animate-fade-in" 
        onClick={() => navigate('/app/readiness')}
        style={{ 
          padding: '32px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px', 
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(139,92,246,0.3)', cursor: 'pointer', transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)', flexShrink: 0 }}>
          <ShieldCheck size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Career Readiness Diagnostic</h2>
            <span className="badge badge-green">Featured</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 12px 0' }}>
            Calibrate your market readiness with an AI-driven resume review and self-assessment. Discover your competency gaps instantly.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} />
              ~5 min
            </span>
            <span className="badge badge-blue">
              5 questions
            </span>
          </div>
        </div>
        <div>
          <button className="btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
            Start Diagnostic <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
