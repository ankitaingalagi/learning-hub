import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader } from 'lucide-react';

function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  const color = scoreColor(feedback.overall_score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{feedback.overall_score}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/100 Overall Score</span>
      </div>

      {/* Strengths */}
      {feedback.strengths?.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CheckCircle size={14} color="#4ade80" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4ade80' }}>Strengths</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {feedback.strengths.map((s, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '6px', top: '6px', width: '4px', height: '4px', borderRadius: '50%', background: '#4ade80' }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {feedback.improvements?.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertTriangle size={14} color="#fbbf24" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fbbf24' }}>Areas to Improve</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {feedback.improvements.map((s, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '6px', top: '6px', width: '4px', height: '4px', borderRadius: '50%', background: '#fbbf24' }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next step */}
      {feedback.next_step && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <ArrowRight size={14} color="var(--accent-electric)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-electric)' }}>Next Step</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {feedback.next_step}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SubmissionPanel({ stepId, submission, onSubmit, useMock }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await onSubmit(stepId, file);
    } catch {
      // Error handled by parent
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  // Already submitted — show feedback
  if (submission) {
    return (
      <div
        style={{
          marginTop: '8px',
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <FileText size={14} color="var(--accent-electric)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{submission.file_name}</span>
          <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
            {submission.status === 'reviewed' ? 'Reviewed' : 'Pending Review'}
          </span>
        </div>

        {submission.status === 'pending_review' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <Loader size={14} style={{ animation: 'spin 2s linear infinite' }} />
            Analyzing your submission...
          </div>
        )}

        {submission.status === 'reviewed' && submission.ai_feedback && (
          <FeedbackDisplay feedback={submission.ai_feedback} />
        )}
      </div>
    );
  }

  // Upload zone
  return (
    <div style={{ marginTop: '8px' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: '24px',
          borderRadius: '10px',
          border: `2px dashed ${dragging ? 'var(--accent-violet)' : 'var(--glass-border)'}`,
          background: dragging ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.01)',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          onChange={onFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.zip,.md"
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Loader size={16} style={{ animation: 'spin 2s linear infinite' }} />
            <span style={{ fontSize: '0.85rem' }}>Uploading...</span>
          </div>
        ) : (
          <>
            <Upload size={24} color="var(--text-secondary)" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Drag & drop your file here or <span style={{ color: 'var(--accent-electric)' }}>browse</span>
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', opacity: 0.6, marginTop: '4px' }}>
              PDF, PNG, JPG, ZIP, MD — Max 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}
