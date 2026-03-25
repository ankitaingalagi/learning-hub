import { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2, Hexagon, CheckCircle, AlertTriangle } from 'lucide-react';

const CHART_COLORS = {
  current: 'var(--accent-violet)',
  currentFill: 'rgba(139, 92, 246, 0.3)',
  required: 'var(--accent-electric)',
  requiredFill: 'rgba(59, 130, 246, 0.15)',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#1a1f36',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.8rem',
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: '6px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: {p.value}/10
        </p>
      ))}
    </div>
  );
}

function GapIndicator({ current, required }) {
  if (current >= required) {
    return <CheckCircle size={16} style={{ color: '#4ade80' }} />;
  }
  const gap = required - current;
  const color = gap >= 3 ? '#f87171' : '#fbbf24';
  return <AlertTriangle size={16} style={{ color }} />;
}

export default function GapChart({ gapProfile }) {
  const [view, setView] = useState('radar');

  if (!gapProfile?.length) return null;

  const data = gapProfile.map((g) => ({
    skill: g.skill,
    Current: g.current,
    Required: g.required,
  }));

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      {/* Header + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Skill Gap Profile</h3>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '3px' }}>
          <button
            onClick={() => setView('radar')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 500, fontFamily: 'inherit',
              background: view === 'radar' ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: view === 'radar' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Hexagon size={14} /> Radar
          </button>
          <button
            onClick={() => setView('bar')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 500, fontFamily: 'inherit',
              background: view === 'bar' ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: view === 'bar' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <BarChart2 size={14} /> Bar
          </button>
        </div>
      </div>

      {/* Radar view */}
      {view === 'radar' && (
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Required"
              dataKey="Required"
              stroke="var(--accent-electric)"
              fill={CHART_COLORS.requiredFill}
              strokeWidth={2}
            />
            <Radar
              name="Current"
              dataKey="Current"
              stroke="var(--accent-violet)"
              fill={CHART_COLORS.currentFill}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingTop: '12px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}

      {/* Bar view */}
      {view === 'bar' && (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" domain={[0, 10]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis
              dataKey="skill"
              type="category"
              width={140}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '12px' }} />
            <Bar dataKey="Current" fill="var(--accent-violet)" radius={[0, 4, 4, 0]} barSize={14} />
            <Bar dataKey="Required" fill="var(--accent-electric)" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Skill gap detail list */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {gapProfile.map((g, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: g.current < g.required ? 'rgba(251,146,60,0.05)' : 'rgba(74,222,128,0.05)',
            }}
          >
            <GapIndicator current={g.current} required={g.required} />
            <span style={{ flex: 1, fontSize: '0.85rem' }}>{g.skill}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {g.current}/{g.required}
            </span>
            {g.current < g.required && (
              <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                Gap: {g.required - g.current}
              </span>
            )}
            {g.current >= g.required && (
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>On track</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
