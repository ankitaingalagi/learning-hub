import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Eye } from 'lucide-react';

export default function Scorecard() {
  const navigate = useNavigate();
  const [showHMPerspective, setShowHMPerspective] = useState(false);
  const [hmLoading, setHmLoading] = useState(false);

  const generateHMView = () => {
    setHmLoading(true);
    setTimeout(() => {
      setHmLoading(false);
      setShowHMPerspective(true);
    }, 1500);
  };

  return (
    <div className="page animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/app/interview-prep')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1 className="page-title text-center" style={{ textAlign: 'center' }}>Session Scorecard</h1>
      
      {/* Overall Score Circle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '4px solid var(--accent-electric)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>3.8<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/5</span></div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginTop: '4px' }}>Overall</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Dimensions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Dimension Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Structure', score: 4.2 },
              { label: 'Clarity', score: 3.5 },
              { label: 'Depth', score: 3.2 },
              { label: 'PM Thinking', score: 4.5 },
            ].map(dim => (
              <div key={dim.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                  <span>{dim.label}</span>
                  <span style={{ fontWeight: 600 }}>{dim.score}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--accent-electric)', width: `${(dim.score / 5) * 100}%`, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Synthesised Feedback */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
              <CheckCircle size={16} /> Top Strength
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Strong PM instincts and focus on user needs. You consistently brought the conversation back to the core problem before jumping to solutions.
            </p>
          </div>
          <div style={{ height: '1px', background: 'var(--glass-border)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
              <AlertCircle size={16} /> Priority to Improve
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Technical depth in answers was lacking. You must be able to discuss engineering trade-offs more fluidly when pressed.
            </p>
          </div>
        </div>
      </div>

      {/* F7: Hiring Manager Perspective */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={18} color="var(--accent-violet)" /> Hiring Manager Perspective
        </h3>
        
        {!showHMPerspective ? (
           <div style={{ textAlign: 'center', padding: '20px' }}>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>See how a real hiring manager would interpret your answers, beyond the rubric.</p>
             <button className="btn-primary" onClick={generateHMView} disabled={hmLoading} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
               {hmLoading ? <RefreshCw size={16} className="animate-spin" /> : null}
               {hmLoading ? 'Generating...' : 'Reveal HM View'}
             </button>
           </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #4ade80' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Green Flag</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Highly user-centric. The candidate naturally structured ambiguity around user cohorts.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #f87171' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Red Flag</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Rambles when discussing implementation details. Needs to be more concise and decisive.</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'linear-gradient(to right, rgba(59,130,246,0.1), transparent)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Decision Framing</div>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', margin: 0 }}>
                "Based on this session, a typical HM would lean towards a 'No Hire' for a Senior role due to lack of technical depth, but a 'Hire' for Mid-level."
              </p>
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
                Flag as inaccurate
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-outline" onClick={() => navigate('/app/interview-prep/history')} style={{ marginRight: '16px' }}>View Transcript</button>
        <button className="btn-primary" onClick={() => navigate('/app/interview-prep')}>Start Another Session</button>
      </div>
    </div>
  );
}
