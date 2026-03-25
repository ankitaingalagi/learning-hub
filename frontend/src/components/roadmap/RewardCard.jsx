import { Gift, Lock, CheckCircle } from 'lucide-react';

export default function RewardCard({ phase, rewardStatus, onClaim }) {
  if (!phase.reward_title) return null;

  const isLocked = rewardStatus === 'locked';
  const isUnclaimed = rewardStatus === 'unclaimed';
  const isClaimed = rewardStatus === 'claimed';

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: isClaimed
          ? 'rgba(74,222,128,0.25)'
          : isUnclaimed
          ? 'rgba(139,92,246,0.35)'
          : 'rgba(255,255,255,0.04)',
        background: isClaimed
          ? 'rgba(74,222,128,0.04)'
          : isUnclaimed
          ? 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))'
          : 'rgba(255,255,255,0.01)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        opacity: isLocked ? 0.5 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isClaimed
            ? 'rgba(74,222,128,0.1)'
            : isUnclaimed
            ? 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))'
            : 'rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isClaimed ? (
          <CheckCircle size={20} color="#4ade80" />
        ) : isLocked ? (
          <Lock size={18} color="var(--text-secondary)" />
        ) : (
          <Gift size={20} color="#fff" />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>
          {phase.reward_title}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {isLocked
            ? `Complete all steps in Phase ${phase.phase_number} to unlock this reward.`
            : phase.reward_description
          }
        </p>
      </div>

      {/* Action */}
      {isUnclaimed && (
        <button
          onClick={(e) => { e.stopPropagation(); onClaim(); }}
          className="btn-primary"
          style={{ borderRadius: '8px', padding: '8px 18px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          Claim Reward
        </button>
      )}
      {isClaimed && (
        <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>Claimed</span>
      )}
    </div>
  );
}
