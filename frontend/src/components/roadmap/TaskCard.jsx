import { useState } from 'react';
import { Play, BookOpen, PenTool, Folder, ExternalLink, Clock, Check, Loader, Upload, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPE_ICONS = { video: Play, reading: BookOpen, practice: PenTool, project: Folder };
const TYPE_COLORS = { video: '#f87171', reading: '#3b82f6', practice: '#fbbf24', project: '#8b5cf6' };
const TYPE_LABELS = { video: 'Video', reading: 'Reading', practice: 'Practice', project: 'Project' };

const STATUS_ORDER = ['pending', 'in_progress', 'completed'];

function formatTime(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function isYouTube(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function StatusCheckbox({ status, onCycle, updating }) {
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onCycle(); }}
      disabled={updating}
      aria-label={`Status: ${status}`}
      className={isCompleted ? 'check-pulse' : ''}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: `2px solid ${isCompleted ? '#4ade80' : isInProgress ? '#fb923c' : 'var(--glass-border)'}`,
        background: isCompleted ? '#4ade80' : 'transparent',
        cursor: updating ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: updating ? 0.5 : 1,
      }}
    >
      {isCompleted && <Check size={14} color="#0b0f19" strokeWidth={3} />}
      {isInProgress && <Loader size={14} color="#fb923c" style={{ animation: 'spin 2s linear infinite' }} />}
    </button>
  );
}

export default function TaskCard({
  step,
  onStatusChange,
  updating,
  locked,
  mentor,
  submission,
  onOpenSubmission,
}) {
  const TypeIcon = TYPE_ICONS[step.step_type] || BookOpen;
  const typeColor = TYPE_COLORS[step.step_type] || '#3b82f6';
  const timeStr = formatTime(step.time_estimate_minutes);

  const cycleStatus = () => {
    const idx = STATUS_ORDER.indexOf(step.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    onStatusChange(step.id, next);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '18px 20px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        opacity: locked ? 0.4 : 1,
        pointerEvents: locked ? 'none' : 'auto',
        filter: locked ? 'grayscale(0.5)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Checkbox */}
      <StatusCheckbox status={step.status} onCycle={cycleStatus} updating={updating} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{step.title}</span>
        </div>

        {/* Description */}
        {step.description && (
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
            {step.description}
          </p>
        )}

        {/* Meta row: type, time, resource */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Type badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: '9999px',
              background: `${typeColor}15`,
              color: typeColor,
              fontSize: '0.72rem',
              fontWeight: 600,
            }}
          >
            <TypeIcon size={12} />
            {TYPE_LABELS[step.step_type] || step.step_type}
          </span>

          {/* Time estimate */}
          {timeStr && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              <Clock size={11} />
              ~{timeStr}
            </span>
          )}

          {/* Points badge */}
          {step.points > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-violet)', fontWeight: 600 }}>
              +{step.points} pts
            </span>
          )}

          {/* Resource link */}
          {step.resource_url && (
            <a
              href={step.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                color: 'var(--accent-electric)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {isYouTube(step.resource_url) ? <Play size={11} /> : <ExternalLink size={11} />}
              {isYouTube(step.resource_url) ? 'Watch Video' : 'Resource'}
            </a>
          )}

          {/* Submission indicator */}
          {step.is_submission_required && (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenSubmission?.(step.id); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: submission ? 'rgba(74,222,128,0.1)' : 'rgba(251,146,60,0.1)',
                color: submission ? '#4ade80' : '#fb923c',
                fontSize: '0.72rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <Upload size={11} />
              {submission ? 'Submitted' : 'Submit Work'}
            </button>
          )}
        </div>

        {/* Mentor badge */}
        {mentor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {mentor.full_name?.[0] || 'M'}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{mentor.full_name}</span>
            <Link
              to="/app/mentors"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: 'var(--accent-electric)', textDecoration: 'none' }}
            >
              <Calendar size={11} />
              Book session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
