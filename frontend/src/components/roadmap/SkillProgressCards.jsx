function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

export default function SkillProgressCards({ steps, gapProfile, activeSkill, onSkillClick }) {
  if (!steps?.length) return null;

  // Group steps by skill_area
  const skillGroups = {};
  steps.forEach((s) => {
    const area = s.skill_area || 'General';
    if (!skillGroups[area]) skillGroups[area] = { total: 0, completed: 0 };
    skillGroups[area].total++;
    if (s.status === 'completed') skillGroups[area].completed++;
  });

  // Order by gap severity (biggest gap first)
  const gapMap = {};
  (gapProfile || []).forEach((g) => {
    gapMap[g.skill] = g.required - g.current;
  });

  const skills = Object.keys(skillGroups).sort((a, b) => (gapMap[b] || 0) - (gapMap[a] || 0));

  return (
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
      {/* All filter */}
      <button
        onClick={() => onSkillClick(null)}
        style={{
          flexShrink: 0,
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: !activeSkill ? 'var(--accent-violet)' : 'var(--glass-border)',
          background: !activeSkill ? 'rgba(139,92,246,0.1)' : 'var(--glass-bg)',
          color: !activeSkill ? 'var(--accent-violet)' : 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
      >
        All ({steps.length})
      </button>

      {skills.map((skill) => {
        const { total, completed } = skillGroups[skill];
        const pct = Math.round((completed / total) * 100);
        const gap = gapMap[skill];
        const isActive = activeSkill === skill;

        return (
          <button
            key={skill}
            onClick={() => onSkillClick(skill)}
            style={{
              flexShrink: 0,
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: isActive ? 'var(--accent-violet)' : 'var(--glass-border)',
              background: isActive ? 'rgba(139,92,246,0.1)' : 'var(--glass-bg)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {skill}
              </span>
              {gap > 0 && (
                <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 600 }}>
                  Gap: {gap}
                </span>
              )}
            </div>
            {/* Mini progress bar */}
            <div style={{ width: '100px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: scoreColor(pct), transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {completed}/{total} done
            </div>
          </button>
        );
      })}
    </div>
  );
}
