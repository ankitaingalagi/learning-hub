import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ─── Analyzing spinner overlay ────────────────────────────────────────────────

function AnalyzingOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(11,15,25,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 100, gap: '20px',
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%',
        border: '3px solid var(--glass-border)',
        borderTopColor: 'var(--accent-electric)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
          Analyzing your responses...
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          This will just take a moment
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TakeAssessment() {
  const { assessment_id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [questions, setQuestions]     = useState([]);
  const [assessmentTitle, setTitle]   = useState('');
  const [currentIdx, setCurrentIdx]   = useState(0);
  // answers: { [question_id]: option_id }
  const [answers, setAnswers]         = useState({});
  const [warning, setWarning]         = useState('');
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [loadError, setLoadError]     = useState('');

  // ── Fetch questions on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!assessment_id) return;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        // Questions
        const qRes = await fetch(`${API}/api/assessments/${assessment_id}/questions`);
        if (!qRes.ok) throw new Error(`Failed to load questions (${qRes.status})`);
        const qData = await qRes.json();
        setQuestions(qData);

        // Assessment title (reuse list endpoint, it's cheap)
        const aRes = await fetch(`${API}/api/assessments/`);
        if (aRes.ok) {
          const allAssessments = await aRes.json();
          const match = allAssessments.find((a) => a.id === assessment_id);
          if (match) setTitle(match.title);
        }
      } catch (err) {
        setLoadError(err.message || 'Failed to load assessment.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [assessment_id]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const total        = questions.length;
  const currentQ     = questions[currentIdx];
  const isFirst      = currentIdx === 0;
  const isLast       = currentIdx === total - 1;
  const progress     = total > 0 ? ((currentIdx + 1) / total) * 100 : 0;
  const hasSelected  = currentQ ? Boolean(answers[currentQ.id]) : false;
  const allAnswered  = total > 0 && questions.every((q) => Boolean(answers[q.id]));
  const options      = Array.isArray(currentQ?.options) ? currentQ.options : [];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setWarning('');
  };

  const handleNext = () => {
    if (!hasSelected) return;            // button is hidden, but guard anyway
    if (currentIdx < total - 1) setCurrentIdx((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      // Find first unanswered question and jump to it
      const firstUnansweredIdx = questions.findIndex((q) => !answers[q.id]);
      setCurrentIdx(firstUnansweredIdx);
      setWarning('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setWarning('');
    try {
      const payload = {
        profile_id: user?.id || '',
        answers: questions.map((q) => ({
          question_id: q.id,
          selected_option_id: answers[q.id],
        })),
      };

      const res = await fetch(`${API}/api/assessments/${assessment_id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Submission failed (${res.status})`);
      }

      const result = await res.json();
      // Persist result locally so Assessments page shows "Retake" button
      const stored = JSON.parse(localStorage.getItem('assessment_results') || '{}');
      stored[assessment_id] = { score: result.total_score, max_score: result.max_score };
      localStorage.setItem('assessment_results', JSON.stringify(stored));
      // Navigate to results page, pass result data via router state
      navigate(`/app/assessments/${assessment_id}/results`, { state: { result } });
    } catch (err) {
      setWarning(err.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', color: 'var(--text-secondary)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent-electric)', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span>Loading assessment...</span>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (loadError || total === 0) {
    return (
      <div className="page">
        <p style={{ color: '#f87171', marginBottom: '16px' }}>{loadError || 'This assessment has no questions yet.'}</p>
        <button className="btn-outline" onClick={() => navigate('/app/assessments')}
          style={{ borderRadius: '8px', padding: '9px 20px', fontSize: '0.875rem' }}>
          ← Back to Assessments
        </button>
      </div>
    );
  }

  return (
    <>
      {submitting && <AnalyzingOverlay />}

      <div className="page animate-fade-in" style={{ opacity: 1, maxWidth: '700px' }}>

        {/* Back link */}
        <button
          className="btn-outline"
          onClick={() => navigate('/app/assessments')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px', borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
        >
          <ChevronLeft size={16} /> Back to Assessments
        </button>

        {/* Assessment title */}
        {assessmentTitle && (
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-electric)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            {assessmentTitle}
          </p>
        )}

        {/* Progress header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Question {currentIdx + 1} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>of {total}</span>
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {Math.round(progress)}% complete
            </span>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                title={`Question ${idx + 1}${answers[q.id] ? ' ✓' : ''}`}
                style={{
                  flex: 1, height: '4px', borderRadius: '9999px', cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: idx === currentIdx
                    ? 'var(--accent-electric)'
                    : answers[q.id]
                    ? 'var(--accent-violet)'
                    : 'var(--glass-border)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Warning banner */}
        {warning && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#fb923c',
            fontSize: '0.875rem', fontWeight: 500,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {warning}
          </div>
        )}

        {/* Question card */}
        <div
          className="glass-panel"
          key={currentQ.id}   /* remount on question change for smooth transition */
          style={{ padding: '32px', marginBottom: '24px', opacity: 1, transform: 'none' }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '28px', color: 'var(--text-primary)' }}>
            {currentQ.text}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.map((option, idx) => {
              const selected = answers[currentQ.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(currentQ.id, option.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px',
                    borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${selected ? 'var(--accent-violet)' : 'var(--glass-border)'}`,
                    background: selected ? 'rgba(139,92,246,0.12)' : 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem', fontWeight: selected ? 600 : 400,
                    transition: 'all 0.18s ease',
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                      e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* Option label pill */}
                  <span style={{
                    flexShrink: 0, width: '26px', height: '26px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.78rem', fontWeight: 700,
                    background: selected ? 'var(--accent-violet)' : 'var(--glass-border)',
                    color: selected ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.18s ease',
                  }}>
                    {OPTION_LABELS[idx]}
                  </span>
                  <span style={{ paddingTop: '2px', lineHeight: 1.5 }}>{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Previous */}
          <button
            className="btn-outline"
            onClick={handlePrev}
            disabled={isFirst}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              borderRadius: '8px', padding: '10px 20px',
              opacity: isFirst ? 0.35 : 1,
              cursor: isFirst ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {/* Next / Submit — only shown once an option is selected */}
          {hasSelected && (
            isLast ? (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  borderRadius: '8px', padding: '11px 28px',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                <CheckCircle size={16} />
                Submit Assessment
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleNext}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '11px 24px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            )
          )}

          {/* Placeholder to keep layout stable when button is hidden */}
          {!hasSelected && <div style={{ width: '110px' }} />}
        </div>

        {/* "X of Y answered" helper */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {Object.keys(answers).length} of {total} questions answered
        </p>
      </div>
    </>
  );
}
