import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const QUESTIONS = [
  { id: 'q1', category: 'Product Sense', text: 'How confidently can you define a target user segment and prioritize their unarticulated needs?' },
  { id: 'q2', category: 'Strategic Thinking', text: 'How confidently can you analyze market trends and defend a build vs. buy decision to executives?' },
  { id: 'q3', category: 'Execution', text: 'How confidently can you break down a 6-month roadmap into 2-week sprints while shielding the team from scope creep?' },
  { id: 'q4', category: 'Data Acumen', text: 'How confidently can you write SQL/queries to independently debug a 15% drop in activation metrics?' },
  { id: 'q5', category: 'Leadership', text: 'How confidently can you gain alignment from a highly skeptical engineering lead on a technical trade-off?' },
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (val) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].id]: val }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Auto-save logic here before navigating
      navigate('/app/readiness/resume-upload');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else navigate('/app/readiness');
  };

  const q = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="page animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '40px' }}>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent-electric)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div className="glass-panel animate-fade-in" key={currentStep} style={{ padding: '40px' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(139,92,246,0.15)', color: 'var(--accent-violet)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '24px' }}>
          {q.category}
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '40px' }}>
          {q.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { val: 1, label: 'Not at all confident (I need heavy guidance)' },
            { val: 2, label: 'Somewhat confident (I can do it with a template)' },
            { val: 3, label: 'Confident (I can do this independently)' },
            { val: 4, label: 'Very confident (I have a strong track record here)' },
            { val: 5, label: 'Expert (I actively mentor others on this)' },
          ].map(opt => (
            <div 
              key={opt.val}
              onClick={() => handleSelect(opt.val)}
              style={{
                padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                border: answers[q.id] === opt.val ? '1px solid var(--accent-electric)' : '1px solid var(--glass-border)',
                background: answers[q.id] === opt.val ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: answers[q.id] === opt.val ? '6px solid var(--accent-electric)' : '2px solid var(--text-secondary)', transition: 'all 0.2s' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: answers[q.id] === opt.val ? 600 : 400, color: answers[q.id] === opt.val ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {opt.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        <button className="btn-outline" onClick={handlePrev} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          className="btn-primary" 
          onClick={handleNext} 
          disabled={!answers[q.id]}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', opacity: !answers[q.id] ? 0.5 : 1 }}
        >
          {currentStep === QUESTIONS.length - 1 ? 'Finish & Next' : 'Continue'} <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
