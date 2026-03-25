import PhaseGroup from './PhaseGroup';

function isPhaseUnlocked(phaseNum, stepsByPhase) {
  if (phaseNum === 1) return true;
  const prevSteps = stepsByPhase[phaseNum - 1] || [];
  return prevSteps.length > 0 && prevSteps.every((s) => s.status === 'completed');
}

function computeRewardStatus(phase, phaseSteps) {
  if (phase.reward_status === 'claimed') return 'claimed';
  const allComplete = phaseSteps.length > 0 && phaseSteps.every((s) => s.status === 'completed');
  return allComplete ? 'unclaimed' : 'locked';
}

export default function PhaseTimeline({
  phases,
  steps,
  activeSkill,
  onStatusChange,
  updatingId,
  mentorsMap,
  submissions,
  onOpenSubmission,
  onClaimReward,
}) {
  if (!phases?.length || !steps?.length) return null;

  // Group steps by phase
  const stepsByPhase = {};
  steps.forEach((s) => {
    const p = s.phase_number || 1;
    if (!stepsByPhase[p]) stepsByPhase[p] = [];
    stepsByPhase[p].push(s);
  });

  // Sort steps within each phase by order_index
  Object.values(stepsByPhase).forEach((arr) =>
    arr.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  );

  // Sort phases by phase_number
  const sortedPhases = [...phases].sort((a, b) => a.phase_number - b.phase_number);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sortedPhases.map((phase, idx) => {
        let phaseSteps = stepsByPhase[phase.phase_number] || [];

        // Apply skill filter if active
        if (activeSkill) {
          phaseSteps = phaseSteps.filter((s) => s.skill_area === activeSkill);
          if (phaseSteps.length === 0) return null;
        }

        const unlocked = isPhaseUnlocked(phase.phase_number, stepsByPhase);
        const rewardStatus = computeRewardStatus(phase, stepsByPhase[phase.phase_number] || []);

        return (
          <PhaseGroup
            key={phase.id}
            phase={phase}
            steps={phaseSteps}
            isLocked={!unlocked}
            isFirst={idx === 0}
            onStatusChange={onStatusChange}
            updatingId={updatingId}
            mentorsMap={mentorsMap}
            submissions={submissions}
            onOpenSubmission={onOpenSubmission}
            onClaimReward={onClaimReward}
            rewardStatus={rewardStatus}
          />
        );
      })}
    </div>
  );
}
