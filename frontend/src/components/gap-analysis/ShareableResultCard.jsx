import { useRef, useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';

function scoreColor(score) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

export default function ShareableResultCard({ archetypes, readiness, gapProfile }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  if (!archetypes?.length || !readiness) return null;

  const archetype = [...archetypes].sort((a, b) => b.score - a.score)[0];

  const topGaps = (gapProfile || [])
    .filter((g) => g.current < g.required)
    .sort((a, b) => (b.required - b.current) - (a.required - a.current))
    .slice(0, 3);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — do nothing
    }
  };

  return (
    <div>
      {/* Card preview */}
      <div
        ref={cardRef}
        style={{
          background: 'linear-gradient(135deg, #0f1221, #1a1f36)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '420px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>LearningHub</span>
        </div>

        {/* Archetype + score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>PM Archetype</p>
            <h4 className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{archetype.name}</h4>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '1.8rem', fontWeight: 800,
                color: scoreColor(readiness.overall),
              }}
            >
              {readiness.overall}
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Readiness</p>
          </div>
        </div>

        {/* Top gaps */}
        {topGaps.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Top Skill Gaps</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topGaps.map((g, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>{g.skill}</span>
                  <span style={{ color: '#fbbf24' }}>Gap: {g.required - g.current}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share button */}
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={handleShare}
          className="btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? 'Link Copied!' : 'Share Results'}
        </button>
      </div>
    </div>
  );
}
