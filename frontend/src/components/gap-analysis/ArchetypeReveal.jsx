import { useState } from 'react';
import { TrendingUp, Cpu, Compass, Layers, RotateCcw, Trophy } from 'lucide-react';

const ICON_MAP = {
  'trending-up': TrendingUp,
  cpu: Cpu,
  compass: Compass,
  layers: Layers,
};

function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function ArchetypeCard({ arch, isTop, isFlipped, onFlip }) {
  const Icon = ICON_MAP[arch.icon] || Compass;
  const color = scoreColor(arch.score);

  return (
    <div style={{ perspective: '1000px', height: '220px' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            borderColor: isTop ? 'rgba(139,92,246,0.35)' : undefined,
            transform: 'none',
          }}
        >
          {/* Best Fit badge */}
          {isTop && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: 'rgba(139,92,246,0.15)',
                color: 'var(--accent-violet)',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <Trophy size={12} /> Best Fit
            </div>
          )}

          {/* Icon + name + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isTop
                  ? 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))'
                  : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={22} color={isTop ? '#fff' : 'var(--text-secondary)'} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{arch.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {arch.tagline}
              </p>
            </div>
          </div>

          {/* Score bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
            <div
              style={{
                flex: 1,
                height: '8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${arch.score}%`,
                  height: '100%',
                  borderRadius: '4px',
                  background: isTop
                    ? 'linear-gradient(90deg, var(--accent-electric), var(--accent-violet))'
                    : color,
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color, minWidth: '32px', textAlign: 'right' }}>
              {arch.score}
            </span>
          </div>

          {/* Flip trigger */}
          <button
            onClick={(e) => { e.stopPropagation(); onFlip(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '6px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontFamily: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <RotateCcw size={13} />
            View reasoning
          </button>
        </div>

        {/* ── BACK ── */}
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            borderColor: isTop ? 'rgba(139,92,246,0.35)' : undefined,
          }}
        >
          {/* Back header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Icon size={18} color={isTop ? 'var(--accent-violet)' : 'var(--text-secondary)'} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{arch.name}</h4>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.85rem',
                fontWeight: 700,
                color,
              }}
            >
              {arch.score}/100
            </span>
          </div>

          {/* Reason text */}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>
            {arch.reason}
          </p>

          {/* Flip back trigger */}
          <button
            onClick={(e) => { e.stopPropagation(); onFlip(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '6px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontFamily: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <RotateCcw size={13} />
            Flip back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchetypeReveal({ archetypes }) {
  const [flippedSet, setFlippedSet] = useState(new Set());

  if (!archetypes?.length) return null;

  const sorted = [...archetypes].sort((a, b) => b.score - a.score);
  const topName = sorted[0]?.name;

  const toggleFlip = (i) => {
    setFlippedSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>PM Archetype Profile</h3>
        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
          {archetypes.length} archetypes assessed
        </span>
      </div>

      <div className="archetype-grid">
        {sorted.map((arch, i) => (
          <ArchetypeCard
            key={arch.name}
            arch={arch}
            isTop={arch.name === topName}
            isFlipped={flippedSet.has(i)}
            onFlip={() => toggleFlip(i)}
          />
        ))}
      </div>
    </div>
  );
}
