import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getGapAnalysis } from '../services/supabase';
import { BarChart2, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

export default function GapAnalysis() {
  const { user } = useAuthStore();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getGapAnalysis(user.id);
        if (fetchError) throw fetchError;
        setAnalysis(data);
      } catch (err) {
        setError('Failed to load gap analysis.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading gap analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ color: '#f87171' }}>{error}</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="page animate-fade-in" style={{ opacity: 1 }}>
        <h1 className="page-title">Gap Analysis</h1>
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', opacity: 1, transform: 'none' }}>
          <BarChart2 size={56} style={{ marginBottom: '20px', opacity: 0.3, color: 'var(--accent-electric)' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>No analysis available yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
            Complete an assessment to generate your personalized gap analysis powered by AI.
          </p>
          <Link to="/app/assessments">
            <button className="btn-primary" style={{ borderRadius: '10px', padding: '12px 28px' }}>
              Take an Assessment
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Parse result_json
  let result = analysis.result_json;
  if (typeof result === 'string') {
    try { result = JSON.parse(result); } catch { result = {}; }
  }

  const strengths = result?.strengths || [];
  const gaps = result?.gaps || [];
  const recommendations = result?.recommendations || [];

  const SectionCard = ({ title, items, icon: Icon, color, bgColor, emptyMsg }) => (
    <div className="glass-panel" style={{ padding: '28px', opacity: 1, transform: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon size={20} />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
        {items.length > 0 && (
          <span className="badge" style={{ background: bgColor, color, marginLeft: 'auto' }}>{items.length}</span>
        )}
      </div>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{emptyMsg}</p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, marginTop: '7px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>Gap Analysis</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          AI-powered analysis of your PM skill profile based on your assessment results.
        </p>
      </div>

      {/* Raw JSON fallback if expected keys not present */}
      {strengths.length === 0 && gaps.length === 0 && recommendations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '28px', opacity: 1, transform: 'none' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Analysis Result</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SectionCard
            title="Strengths"
            items={strengths}
            icon={TrendingUp}
            color="#4ade80"
            bgColor="rgba(34,197,94,0.1)"
            emptyMsg="No strengths identified yet."
          />
          <SectionCard
            title="Skill Gaps"
            items={gaps}
            icon={AlertCircle}
            color="#fb923c"
            bgColor="rgba(251,146,60,0.1)"
            emptyMsg="No gaps identified yet."
          />
          <SectionCard
            title="Recommendations"
            items={recommendations}
            icon={Lightbulb}
            color="var(--accent-electric)"
            bgColor="rgba(59,130,246,0.1)"
            emptyMsg="No recommendations yet."
          />
        </div>
      )}

      <div style={{ marginTop: '28px' }}>
        <Link to="/app/roadmap">
          <button className="btn-primary" style={{ borderRadius: '10px', padding: '12px 28px' }}>
            View My Roadmap →
          </button>
        </Link>
      </div>
    </div>
  );
}
