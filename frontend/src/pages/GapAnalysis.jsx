import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getGapAnalysis, getRoadmap } from '../services/supabase';
import { MOCK_GAP_ANALYSIS } from '../data/mockGapAnalysis';

import ArchetypeReveal from '../components/gap-analysis/ArchetypeReveal';
import ReadinessScore from '../components/gap-analysis/ReadinessScore';
import GapChart from '../components/gap-analysis/GapChart';
import ResumeAnalysisBadge from '../components/gap-analysis/ResumeAnalysisBadge';
import FitmentScoreCards from '../components/gap-analysis/FitmentScoreCards';
import RoadmapCTA from '../components/gap-analysis/RoadmapCTA';
import ShareableResultCard from '../components/gap-analysis/ShareableResultCard';
import EmptyState from '../components/gap-analysis/EmptyState';

export default function GapAnalysis() {
  const { user } = useAuthStore();
  const [result, setResult] = useState(null);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Toggle this to false when backend is connected
  const USE_MOCK = true;

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        if (USE_MOCK) {
          setResult(MOCK_GAP_ANALYSIS);
          setHasRoadmap(false);
        } else {
          const [analysisRes, roadmapRes] = await Promise.all([
            getGapAnalysis(user.id),
            getRoadmap(user.id),
          ]);

          if (analysisRes.error) throw analysisRes.error;

          let parsed = analysisRes.data?.result_json;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch { parsed = null; }
          }

          setResult(parsed || null);
          setHasRoadmap(!!roadmapRes.data);
        }
      } catch {
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
        <div className="loading-pulse" style={{ color: 'var(--text-secondary)' }}>Loading gap analysis...</div>
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

  if (!result) {
    return (
      <div className="page animate-fade-in" style={{ opacity: 1 }}>
        <h1 className="page-title">Gap Analysis</h1>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>Gap Analysis</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          AI-powered analysis of your PM skill profile based on your assessment results.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Archetype Reveal */}
        <div className="animate-fade-in">
          <ArchetypeReveal archetypes={result.archetypes} />
        </div>

        {/* 2. Readiness Score + 3. Resume Badge — side by side on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="animate-fade-in delay-100">
            <ReadinessScore readiness={result.readiness} />
          </div>
          <div className="animate-fade-in delay-200">
            <ResumeAnalysisBadge resumeSkills={result.resume_skills} />
          </div>
        </div>

        {/* 3. Gap Profile Chart */}
        <div className="animate-fade-in delay-100">
          <GapChart gapProfile={result.gap_profile} />
        </div>

        {/* 4. Fitment Score Cards */}
        <div className="animate-fade-in delay-200">
          <FitmentScoreCards fitmentScores={result.fitment_scores} />
        </div>

        {/* 5. Roadmap CTA */}
        <div className="animate-fade-in delay-300">
          <RoadmapCTA hasRoadmap={hasRoadmap} />
        </div>

        {/* 6. Shareable Results (nice-to-have) */}
        <div className="animate-fade-in delay-300">
          <div style={{ marginTop: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Share Your Results</h3>
            <ShareableResultCard
              archetypes={result.archetypes}
              readiness={result.readiness}
              gapProfile={result.gap_profile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
