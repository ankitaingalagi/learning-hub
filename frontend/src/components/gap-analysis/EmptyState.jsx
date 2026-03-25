import { Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';

export default function EmptyState() {
  return (
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
  );
}
