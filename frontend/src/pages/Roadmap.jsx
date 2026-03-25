import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  getRoadmap, getGapAnalysis, updateRoadmapStep, generateRoadmap,
  updateRoadmapReadiness, claimPhaseReward,
} from '../services/supabase';
import { MOCK_ROADMAP, MOCK_PHASES, MOCK_ROADMAP_CONTEXT, MOCK_SUBMISSIONS, MOCK_MENTORS_MAP } from '../data/mockRoadmap';

import RoadmapHeader from '../components/roadmap/RoadmapHeader';
import SkillProgressCards from '../components/roadmap/SkillProgressCards';
import PhaseTimeline from '../components/roadmap/PhaseTimeline';
import GenerateRoadmap from '../components/roadmap/GenerateRoadmap';
import CompletionCard from '../components/roadmap/CompletionCard';
import SubmissionPanel from '../components/roadmap/SubmissionPanel';
import ToastContainer from '../components/ui/Toast';
import useToast from '../hooks/useToast';

export default function Roadmap() {
  const { user } = useAuthStore();
  const { toasts, addToast } = useToast();

  const [steps, setSteps] = useState([]);
  const [phases, setPhases] = useState([]);
  const [context, setContext] = useState(null);
  const [readinessScore, setReadinessScore] = useState(0);
  const [roadmapId, setRoadmapId] = useState(null);
  const [submissions, setSubmissions] = useState({});
  const [mentorsMap, setMentorsMap] = useState({});

  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [openSubmissionStepId, setOpenSubmissionStepId] = useState(null);
  const [error, setError] = useState('');

  const USE_MOCK = true;

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (USE_MOCK) {
        setSteps(MOCK_ROADMAP.roadmap_steps);
        setPhases(MOCK_PHASES);
        setContext(MOCK_ROADMAP_CONTEXT);
        setReadinessScore(MOCK_ROADMAP.readiness_score || 0);
        setRoadmapId(MOCK_ROADMAP.id);
        setSubmissions(MOCK_SUBMISSIONS);
        setMentorsMap(MOCK_MENTORS_MAP);
        setHasAnalysis(true);
        setHasRoadmap(true);
      } else {
        const [analysisRes, roadmapRes] = await Promise.all([
          getGapAnalysis(user.id),
          getRoadmap(user.id),
        ]);

        if (analysisRes.data) {
          setHasAnalysis(true);
          let parsed = analysisRes.data.result_json;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch { parsed = {}; }
          }
          const topArchetype = parsed?.archetypes
            ? [...parsed.archetypes].sort((a, b) => b.score - a.score)[0]?.name
            : 'PM';
          setContext({
            archetype: topArchetype,
            readiness: parsed?.readiness?.overall || 0,
            gap_profile: (parsed?.gap_profile || []).filter((g) => g.current < g.required),
          });
        }

        if (roadmapRes.data?.roadmap_steps?.length) {
          setHasRoadmap(true);
          setRoadmapId(roadmapRes.data.id);
          setReadinessScore(roadmapRes.data.readiness_score || 0);

          const sorted = [...roadmapRes.data.roadmap_steps].sort(
            (a, b) => (a.order_index || 0) - (b.order_index || 0)
          );
          setSteps(sorted);
          setPhases(roadmapRes.data.roadmap_phases || []);

          // Build mentors map from joined data
          const mMap = {};
          sorted.forEach((s) => {
            if (s.mentor_id && s.mentors?.profiles) {
              mMap[s.mentor_id] = s.mentors.profiles;
            }
          });
          setMentorsMap(mMap);
        }
      }
    } catch {
      setError('Failed to load roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      await generateRoadmap(user.id);
      await loadData();
      addToast('Roadmap generated!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (stepId, newStatus) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    const oldStatus = step.status;
    setUpdatingId(stepId);

    try {
      if (!USE_MOCK) {
        const { error: updateError } = await updateRoadmapStep(stepId, newStatus);
        if (updateError) throw updateError;
      }

      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status: newStatus } : s))
      );

      // Points logic
      const pts = step.points || 0;
      if (newStatus === 'completed' && oldStatus !== 'completed') {
        setReadinessScore((prev) => {
          const next = prev + pts;
          if (!USE_MOCK && roadmapId) updateRoadmapReadiness(roadmapId, next);
          return next;
        });
        if (pts > 0) addToast(`+${pts} points`, 'points');
      } else if (oldStatus === 'completed' && newStatus !== 'completed') {
        setReadinessScore((prev) => {
          const next = Math.max(0, prev - pts);
          if (!USE_MOCK && roadmapId) updateRoadmapReadiness(roadmapId, next);
          return next;
        });
      }
    } catch {
      setError('Failed to update step.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClaimReward = async (phaseId) => {
    try {
      if (!USE_MOCK) {
        const { error: claimError } = await claimPhaseReward(phaseId);
        if (claimError) throw claimError;
      }
      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, reward_status: 'claimed' } : p))
      );
      addToast('Reward claimed!', 'success');
    } catch {
      setError('Failed to claim reward.');
    }
  };

  const handleSubmission = async (stepId, file) => {
    if (USE_MOCK) {
      // Simulate submission
      setSubmissions((prev) => ({
        ...prev,
        [stepId]: {
          id: `sub-mock-${stepId}`,
          step_id: stepId,
          file_name: file.name,
          file_url: '#',
          status: 'pending_review',
          ai_feedback: null,
          created_at: new Date().toISOString(),
        },
      }));
      addToast('Submission uploaded!', 'success');

      // Simulate AI feedback after 3s
      setTimeout(() => {
        setSubmissions((prev) => ({
          ...prev,
          [stepId]: {
            ...prev[stepId],
            status: 'reviewed',
            ai_feedback: {
              overall_score: 72,
              strengths: ['Good structure and clarity', 'Strong analytical approach'],
              improvements: ['Add more quantitative evidence', 'Consider edge cases'],
              next_step: 'Apply these improvements and move to the next task.',
            },
          },
        }));
        addToast('AI feedback ready!', 'success');
      }, 3000);
      return;
    }

    // Real flow — handled by supabase functions
    // uploadSubmissionFile -> createSubmission -> requestAIFeedback
  };

  // Loading
  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="loading-pulse" style={{ color: 'var(--text-secondary)' }}>Loading roadmap...</div>
      </div>
    );
  }

  // Error only
  if (error && !hasRoadmap) {
    return (
      <div className="page">
        <h1 className="page-title">My Roadmap</h1>
        <div style={{ color: '#f87171', marginBottom: '16px' }}>{error}</div>
      </div>
    );
  }

  // No roadmap — show generate state
  if (!hasRoadmap) {
    return (
      <div className="page animate-fade-in" style={{ opacity: 1 }}>
        <h1 className="page-title">My Roadmap</h1>
        <GenerateRoadmap
          hasAnalysis={hasAnalysis}
          onGenerate={handleGenerate}
          generating={generating}
        />
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  const allComplete = steps.length > 0 && steps.every((s) => s.status === 'completed');

  // Compute max possible points for readiness display
  const maxPoints = steps.reduce((sum, s) => sum + (s.points || 0), 0);
  const readinessPct = maxPoints > 0 ? Math.min(100, Math.round((readinessScore / maxPoints) * 100)) : 0;

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      {error && (
        <div style={{ color: '#f87171', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <RoadmapHeader
          archetype={context?.archetype || 'PM'}
          readiness={readinessPct}
          steps={steps}
          onRegenerate={handleGenerate}
          regenerating={generating}
        />

        {/* Skill filter */}
        <SkillProgressCards
          steps={steps}
          gapProfile={context?.gap_profile}
          activeSkill={activeSkill}
          onSkillClick={setActiveSkill}
        />

        {/* Completion card if all done */}
        {allComplete && <CompletionCard />}

        {/* Phase timeline */}
        <PhaseTimeline
          phases={phases}
          steps={steps}
          activeSkill={activeSkill}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
          mentorsMap={mentorsMap}
          submissions={submissions}
          onOpenSubmission={setOpenSubmissionStepId}
          onClaimReward={handleClaimReward}
        />

        {/* Submission panel modal — shown when a step's "Submit Work" is clicked */}
        {openSubmissionStepId && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setOpenSubmissionStepId(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '540px',
                margin: '16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '28px',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  Submit Work: {steps.find((s) => s.id === openSubmissionStepId)?.title}
                </h3>
                <button
                  onClick={() => setOpenSubmissionStepId(null)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '1.2rem', fontFamily: 'inherit',
                  }}
                >
                  ✕
                </button>
              </div>
              <SubmissionPanel
                stepId={openSubmissionStepId}
                submission={submissions[openSubmissionStepId]}
                onSubmit={handleSubmission}
                useMock={USE_MOCK}
              />
            </div>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
