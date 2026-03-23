import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getAssessmentWithQuestions, submitAssessmentResult } from '../services/supabase';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function TakeAssessment() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getAssessmentWithQuestions(id);
        if (fetchError) throw fetchError;
        setAssessment(data);
        setQuestions(data?.assessment_questions || []);
      } catch (err) {
        setError('Failed to load assessment.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const currentQuestion = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option.id }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      // Auth bypassed — skip saving result and go straight to gap analysis
      navigate('/app/gap-analysis');
      return;
    }
    setSubmitting(true);
    try {
      // Score = sum of selected option scores (each option has score 1–4)
      const score = questions.reduce((total, q) => {
        const selectedId = answers[q.id];
        const option = (q.options || []).find(o => o.id === selectedId);
        return total + (option?.score || 0);
      }, 0);
      const { error: submitError } = await submitAssessmentResult(user.id, id, score);
      if (submitError) throw submitError;
      navigate('/app/gap-analysis');
    } catch (err) {
      alert(err.message || 'Failed to submit assessment.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading assessment...</div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="page">
        <div style={{ color: '#f87171' }}>{error || 'Assessment not found.'}</div>
        <button className="btn-outline" onClick={() => navigate('/app/assessments')} style={{ marginTop: '16px' }}>
          Back to Assessments
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">{assessment.title}</h1>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          This assessment has no questions yet.
        </div>
        <button className="btn-outline" onClick={() => navigate('/app/assessments')} style={{ marginTop: '16px' }}>
          Back
        </button>
      </div>
    );
  }

  // options is always an array of {id, text, score} objects from Supabase JSONB
  const options = Array.isArray(currentQuestion?.options) ? currentQuestion.options : [];

  return (
    <div className="page animate-fade-in" style={{ opacity: 1, maxWidth: '680px' }}>
      {/* Back */}
      <button
        className="btn-outline"
        onClick={() => navigate('/app/assessments')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
      >
        <ChevronLeft size={16} /> Back to Assessments
      </button>

      {/* Header */}
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{assessment.title}</h1>

      {/* Progress bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div style={{ height: '6px', background: 'var(--glass-bg)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', opacity: 1, transform: 'none' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '24px' }}>
          {currentQuestion.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No options available for this question.</p>
          ) : (
            options.map((option, idx) => {
              const selected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(currentQuestion.id, option)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px',
                    borderRadius: '10px', border: `2px solid ${selected ? 'var(--accent-electric)' : 'var(--glass-border)'}`,
                    background: selected ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease',
                    fontWeight: selected ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                  onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                >
                  <span style={{ fontWeight: 600, marginRight: '10px', color: 'var(--accent-electric)' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option.text}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="btn-outline"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '10px 20px', opacity: currentIdx === 0 ? 0.4 : 1, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer' }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {isLast ? (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', padding: '10px 24px', opacity: submitting ? 0.7 : 1 }}
          >
            <CheckCircle size={16} />
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleNext}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '10px 24px' }}
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
