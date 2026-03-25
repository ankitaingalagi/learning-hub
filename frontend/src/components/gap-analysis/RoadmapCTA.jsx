import { Link } from 'react-router-dom';
import { Map, ArrowRight } from 'lucide-react';

export default function RoadmapCTA({ hasRoadmap = false }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
        borderColor: 'rgba(139,92,246,0.2)',
      }}
    >
      <div
        style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <Map size={28} color="#fff" />
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
        {hasRoadmap ? 'Your Roadmap is Ready' : 'Build Your Personalized Roadmap'}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
        {hasRoadmap
          ? 'Continue your learning journey with a step-by-step plan tailored to your skill gaps.'
          : 'Get a step-by-step learning plan tailored to close your skill gaps and accelerate your PM career.'
        }
      </p>

      <Link to="/app/roadmap">
        <button
          className="btn-primary"
          style={{ borderRadius: '10px', padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {hasRoadmap ? 'View Your Roadmap' : 'Build My Roadmap'}
          <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  );
}
