import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Map, BarChart2, Users, FileText, ArrowRight } from 'lucide-react';

const INTERVIEW_TYPES = [
  { id: 'product_design', title: 'Product Design', desc: 'Design a product for a specific user segment', icon: Target },
  { id: 'strategy', title: 'Product Strategy', desc: 'Evaluate market entry and business strategy', icon: Map },
  { id: 'analytical', title: 'Analytical', desc: 'Identify root causes and define metrics', icon: BarChart2 },
  { id: 'behavioural', title: 'Behavioural', desc: 'Leadership, conflict, and past challenges', icon: Users },
];

export default function Index() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');

  const handleStartSession = () => {
    if (!selectedType) {
      setError('Please select an interview type to continue.');
      return;
    }
    navigate(`/app/interview-prep/session?type=${selectedType}`);
  };

  return (
    <div className="page animate-fade-in">
      <h1 className="page-title">Interview Prep</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Practice with AI and get structured feedback based on real hiring manager rubrics.
      </p>

      {/* F1: Interview Type Selector */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Select Interview Type</h2>
        
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', color: '#f87171', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          {INTERVIEW_TYPES.map(type => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <div 
                key={type.id}
                onClick={() => { setSelectedType(type.id); setError(''); }}
                style={{ 
                  background: isSelected ? 'rgba(59,130,246,0.1)' : 'var(--glass-bg)', 
                  border: `1px solid ${isSelected ? 'var(--accent-electric)' : 'var(--glass-border)'}`,
                  borderRadius: '12px', padding: '20px', cursor: 'pointer',
                  display: 'flex', gap: '16px', alignItems: 'center', transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? 'var(--accent-electric)' : 'var(--text-secondary)' }}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{type.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{type.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-primary" onClick={handleStartSession} style={{ padding: '12px 32px' }}>
          Start Session
        </button>
      </div>

      <div className="grid-2">
        {/* F5: Past Sessions Preview */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Sessions</h2>
            <button onClick={() => navigate('/app/interview-prep/history')} style={{ background: 'none', border: 'none', color: 'var(--accent-electric)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Product Design', 'Analytical'].map((t, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{t} Mock</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{i === 0 ? 'Yesterday' : 'May 12'} · 5 Questions</div>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--accent-electric)' }}>{i === 0 ? '4.2/5' : '3.8/5'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* F6: Resource Cards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Quick Resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['STAR Framework Guide', 'Top 15 PM Questions', 'Resume Impact phrasing'].map((title, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                <div style={{ color: 'var(--accent-violet)' }}><FileText size={16} /></div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
