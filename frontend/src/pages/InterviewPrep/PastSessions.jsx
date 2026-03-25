import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, ChevronRight } from 'lucide-react';

const SESSIONS = [
  { id: 1, type: 'Product Design', score: 3.8, duration: '24 min', date: 'April 20, 2026' },
  { id: 2, type: 'Analytical', score: 4.1, duration: '28 min', date: 'April 15, 2026' },
  { id: 3, type: 'Strategy', score: 3.2, duration: '20 min', date: 'April 02, 2026' },
];

export default function PastSessions() {
  const navigate = useNavigate();

  return (
    <div className="page animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/app/interview-prep')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <History size={28} color="var(--accent-electric)" /> Past Sessions
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Review your past transcripts and track your progress over time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {SESSIONS.map(session => (
          <div 
            key={session.id} 
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => navigate('/app/interview-prep/scorecard')} // Mocking detail view using scorecard
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{session.type} Mock</h3>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-secondary)' }}>{session.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Overall: <strong style={{ color: 'var(--text-primary)' }}>{session.score}/5</strong></span>
                <span>Duration: {session.duration}</span>
              </div>
            </div>
            <div style={{ color: 'var(--accent-electric)' }}>
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
