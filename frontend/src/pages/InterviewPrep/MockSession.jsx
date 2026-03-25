import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, ArrowRight, User, Bot, AlertTriangle } from 'lucide-react';

const MOCK_QUESTIONS = [
  "How would you improve Google Maps? Tell me about the user segments and the pain points.",
  "Which goal metrics would you track for your new feature, and how do you define success?",
  "What trade-offs would you have to make between technical feasibility and user experience for this feature?",
  "Tell me about a time you disagreed with engineering on a feature constraint. How did you resolve it?",
  "How would you handle a sudden 15% drop in engagement after your feature launches?"
];

export default function MockSession() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'Session';
  const navigate = useNavigate();
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    // F2: Initialise first question
    if (chatLog.length === 0) {
      setChatLog([{ role: 'bot', text: MOCK_QUESTIONS[0] }]);
    }
  }, [chatLog.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isProcessing]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!answer.trim()) return;

    // Reject short answers (Mocking F2 Business logic)
    if (answer.split(' ').length < 10 && !answer.includes('skip')) {
      if (!window.confirm("Your answer seems short — would you like to submit anyway?")) {
        return;
      }
    }

    const newLog = [...chatLog, { role: 'user', text: answer }];
    setChatLog(newLog);
    setAnswer('');
    setIsProcessing(true);

    // Simulate AI eval delay
    setTimeout(() => {
      // Generate Feedback (F3)
      const feedback = {
        role: 'feedback',
        strengths: ["Clear initial framing.", "Addressed the core problem."],
        gaps: ["Lacked specific metrics.", "Consideredge cases more deeply."],
        suggestion: "Use the STAR or CIRCLES method more explicitly to structure your thought process.",
        scores: { structure: 4, clarity: 3, depth: 3, pmThinking: 4 }
      };
      
      const nextQIndex = currentQIndex + 1;
      
      if (nextQIndex < 5) {
        setChatLog([...newLog, feedback, { role: 'bot', text: MOCK_QUESTIONS[nextQIndex] }]);
        setCurrentQIndex(nextQIndex);
        setIsProcessing(false);
      } else {
        // End of session (F4)
        setChatLog([...newLog, feedback, { role: 'system', text: "Session complete. Generating scorecard..." }]);
        setTimeout(() => {
          navigate('/app/interview-prep/scorecard');
        }, 1500);
      }
    }, 2000);
  };

  return (
    <div className="page" style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{type.replace('_', ' ')} Mock Interview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Question {Math.min(currentQIndex + 1, 5)} of 5</p>
        </div>
        <button className="btn-outline" onClick={() => { if(window.confirm('Abandon session?')) navigate('/app/interview-prep'); }}>
          Exit Session
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {chatLog.map((msg, i) => {
            if (msg.role === 'bot') {
              return (
                <div key={i} style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="white" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px 18px', borderRadius: '0 12px 12px 12px', border: '1px solid var(--glass-border)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                    {msg.text}
                  </div>
                </div>
              );
            }
            if (msg.role === 'user') {
              return (
                <div key={i} style={{ display: 'flex', gap: '12px', maxWidth: '85%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} />
                  </div>
                  <div style={{ background: 'rgba(59,130,246,0.15)', padding: '14px 18px', borderRadius: '12px 0 12px 12px', border: '1px solid rgba(59,130,246,0.3)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                    {msg.text}
                  </div>
                </div>
              );
            }
            if (msg.role === 'feedback') {
              // F3: Inline structured feedback
              return (
                <div key={i} style={{ margin: '0 auto', width: '90%', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#4ade80', fontWeight: 600, fontSize: '0.9rem' }}>
                    <AlertTriangle size={16} /> AI Feedback Reference
                  </div>
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Strengths</div>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, gap: '4px', display: 'flex', flexDirection: 'column' }}>
                        {msg.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Gaps</div>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, gap: '4px', display: 'flex', flexDirection: 'column' }}>
                        {msg.gaps.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Suggestion: </span>
                    {msg.suggestion}
                  </div>
                </div>
              );
            }
            if (msg.role === 'system') {
              return (
                <div key={i} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {msg.text}
                </div>
              )
            }
            return null;
          })}
          
          {isProcessing && (
            <div style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="white" />
              </div>
              <div style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Evaluating answer...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ borderTop: '1px solid var(--glass-border)', padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isProcessing}
              style={{
                width: '100%', minHeight: '100px', resize: 'vertical',
                padding: '16px', paddingRight: '60px', borderRadius: '12px',
                background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', fontSize: '0.95rem',
                fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
                opacity: isProcessing ? 0.6 : 1
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e);
              }}
            />
            <button
              type="submit"
              disabled={!answer.trim() || isProcessing}
              style={{
                position: 'absolute', right: '16px', bottom: '16px',
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'var(--accent-electric)', color: 'white',
                border: 'none', cursor: (!answer.trim() || isProcessing) ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (!answer.trim() || isProcessing) ? 0.5 : 1, transition: 'all 0.2s'
              }}
            >
              <Send size={16} />
            </button>
            <div style={{ position: 'absolute', bottom: '-22px', right: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Cmd/Ctrl + Enter to send
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
