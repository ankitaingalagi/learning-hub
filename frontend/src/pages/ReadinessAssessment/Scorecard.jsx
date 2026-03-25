import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Target, AlertCircle, ArrowLeft, Zap, Compass, CheckCircle } from 'lucide-react';

export default function ReadinessScorecard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const withResume = searchParams.get('resume') === 'true';

  // Mock score derived logic
  const readinessPercentage = withResume ? 72 : 78; // Often lower with reality-check
  
  const competencies = [
    { label: 'Product Sense', score: 4.5, icon: Target, color: 'var(--accent-electric)' },
    { label: 'Strategic Thinking', score: 3.2, icon: Compass, color: 'var(--accent-violet)' },
    { label: 'Execution', score: withResume ? 3.5 : 4.5, icon: Zap, color: '#f59e0b' },
    { label: 'Data Acumen', score: 4.0, icon: BarChart2Icon, color: '#10b981' },
    { label: 'Leadership', score: 3.8, icon: CheckCircle, color: '#ec4899' },
  ];

  function BarChart2Icon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
  }

  return (
    <div className="page animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/app/readiness')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Start
      </button>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Market Readiness Score</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Target Role: <strong style={{ color: 'var(--text-primary)' }}>Senior Product Manager</strong>
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Overall Score */}
        <div className="glass-panel" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(var(--accent-electric) ${readinessPercentage}%, rgba(255,255,255,0.05) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{readinessPercentage}%</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ready</span>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            You meet approximately {readinessPercentage}% of the signals expected for a Senior PM role in today's market based on your {withResume ? 'assessment and resume' : 'self-assessment'}.
          </p>
        </div>

        {/* Competency Breakdown */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px' }}>Competency Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {competencies.map(comp => (
              <div key={comp.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 500 }}>
                    <comp.icon size={16} color={comp.color} /> {comp.label}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comp.score}/5.0</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: comp.color, width: `${(comp.score / 5) * 100}%`, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Insights (F3) */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Actionable Insights</h3>
      <div className="grid-2">
        {withResume ? (
          <>
            <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <AlertCircle size={16} /> Discrepancy Detected
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Execution signals missing on resume</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                You rated highly on Execution (4.5), but your resume lacks direct evidence of shipping features. Add delivery metrics or methodologies (Agile) to bullet points 2 and 4.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #4ade80' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <CheckCircle size={16} /> Verified Strength
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Strong analytical background</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Your self-assessment rating in Data Acumen aligns perfectly with the strong quantitative metrics you've highlighted in your most recent role.
              </p>
            </div>
          </>
        ) : (
          <div className="glass-panel" style={{ padding: '32px', gridColumn: '1 / -1', textAlign: 'center', border: '1px dashed var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <AlertCircle size={32} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Calibration Limited</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
              These scores are based entirely on your self-assessment. To unlock specific discrepancies and verify your readiness against market standards, upload your resume.
            </p>
            <button className="btn-outline" onClick={() => navigate('/app/readiness/resume-upload')} style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Upload Resume Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
