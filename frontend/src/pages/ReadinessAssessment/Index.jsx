import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart, FileText, ArrowRight } from 'lucide-react';

export default function ReadinessIndex() {
  const navigate = useNavigate();

  return (
    <div className="page animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', color: 'var(--accent-electric)', marginBottom: '24px' }}>
          <ShieldCheck size={32} />
        </div>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Career Readiness Assessment</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Discover exactly where you stand in the market. Calibrate your self-assessment against an AI-driven review of your resume to uncover hidden gaps.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '48px' }}>
        <div className="glass-panel text-center" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BarChart size={28} color="var(--accent-electric)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>1. Self-Assess</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Answer a 5-minute diagnostic on core PM competencies.</p>
        </div>
        <div className="glass-panel text-center" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <FileText size={28} color="var(--accent-violet)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>2. Upload Resume</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Optionally upload your resume for AI verification.</p>
        </div>
        <div className="glass-panel text-center" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <ShieldCheck size={28} color="#4ade80" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>3. Get Readiness Score</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Receive your market readiness percentage and gap analysis.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', border: '1px solid rgba(59,130,246,0.3)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Ready to calibrate your career?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Takes ~5 minutes. Your results are private.</p>
        <button className="btn-primary" onClick={() => navigate('/app/readiness/questionnaire')} style={{ padding: '14px 36px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Start Diagnostic <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
