import { Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import TaskCard from './TaskCard';
import RewardCard from './RewardCard';

function scoreColor(pct) {
  if (pct >= 75) return '#4ade80';
  if (pct >= 50) return '#fbbf24';
  return 'var(--text-secondary)';
}

export default function PhaseGroup({
  phase,
  steps,
  isLocked,
  isFirst,
  onStatusChange,
  updatingId,
  mentorsMap,
  submissions,
  onOpenSubmission,
  onClaimReward,
  rewardStatus,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const completed = steps.filter((s) => s.status === 'completed').length;
  const total = steps.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const color = scoreColor(pct);

  return (
    <div style={{ position: 'relative' }}>
      {/* Phase header */}
      <div
        onClick={() => !isLocked && setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 20px',
          background: isLocked ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
          border: '1px solid',
          borderColor: isLocked ? 'rgba(255,255,255,0.04)' : 'var(--glass-border)',
          borderRadius: '14px',
          marginBottom: isLocked || collapsed ? '0' : '12px',
          cursor: isLocked ? 'default' : 'pointer',
          opacity: isLocked ? 0.5 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Phase number circle */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isLocked
              ? 'rgba(255,255,255,0.04)'
              : pct === 100
              ? 'rgba(74,222,128,0.15)'
              : 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isLocked ? (
            <Lock size={16} color="var(--text-secondary)" />
          ) : (
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: pct === 100 ? '#4ade80' : '#fff' }}>
              {phase.phase_number}
            </span>
          )}
        </div>

        {/* Title + subtitle */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>{phase.title}</h3>
          {phase.subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{phase.subtitle}</p>
          )}
        </div>

        {/* Progress + lock */}
        {isLocked ? (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Complete Phase {phase.phase_number - 1} to unlock
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mini progress */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{completed}/{total}</span>
              <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', marginTop: '4px' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: color, transition: 'width 0.4s ease' }} />
              </div>
            </div>
            {/* Collapse chevron */}
            {collapsed ? <ChevronRight size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
          </div>
        )}
      </div>

      {/* Steps — hidden if locked or collapsed */}
      {!isLocked && !collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', marginBottom: '12px' }}>
          {steps.map((step) => (
            <TaskCard
              key={step.id}
              step={step}
              onStatusChange={onStatusChange}
              updating={updatingId === step.id}
              locked={false}
              mentor={step.mentor_id ? mentorsMap?.[step.mentor_id] : null}
              submission={submissions?.[step.id]}
              onOpenSubmission={onOpenSubmission}
            />
          ))}

          {/* Reward card after last step */}
          {phase.reward_title && (
            <RewardCard
              phase={phase}
              rewardStatus={rewardStatus}
              onClaim={() => onClaimReward?.(phase.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}
