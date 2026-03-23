import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getProgram, getLessonProgress, upsertProgress } from '../services/supabase';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function LessonViewer() {
  const { programId, lessonId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [progressStatus, setProgressStatus] = useState('not_started');
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !programId || !lessonId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [progRes, progressRes] = await Promise.all([
          getProgram(programId),
          getLessonProgress(user.id, lessonId),
        ]);
        if (progRes.error) throw progRes.error;

        const prog = progRes.data;
        setProgram(prog);

        // Flatten all lessons in order
        const sorted = [...(prog.modules || [])].sort((a, b) => a.order_index - b.order_index);
        const flat = sorted.flatMap(m => [...(m.lessons || [])].sort((a, b) => (a.id > b.id ? 1 : -1)));
        setAllLessons(flat);

        const found = flat.find(l => String(l.id) === String(lessonId));
        setLesson(found || null);

        setProgressStatus(progressRes.data?.status || 'not_started');
      } catch (err) {
        setError('Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, programId, lessonId]);

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      await upsertProgress(user.id, lessonId, 'completed');
      setProgressStatus('completed');
    } catch (err) {
      alert('Failed to update progress.');
    } finally {
      setMarking(false);
    }
  };

  const currentIndex = allLessons.findIndex(l => String(l.id) === String(lessonId));
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="page">
        <div style={{ color: '#f87171' }}>{error || 'Lesson not found.'}</div>
        <button className="btn-outline" onClick={() => navigate(`/app/programs/${programId}`)} style={{ marginTop: '16px' }}>
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1, maxWidth: '800px' }}>
      {/* Back button */}
      <button
        className="btn-outline"
        onClick={() => navigate(`/app/programs/${programId}`)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
      >
        <ChevronLeft size={16} /> Back to {program?.title || 'Course'}
      </button>

      {/* Lesson header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{lesson.title}</h1>
          {progressStatus === 'completed' && (
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={12} /> Completed
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Lesson {currentIndex + 1} of {allLessons.length}
        </div>
      </div>

      {/* Lesson content */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px', opacity: 1, transform: 'none' }}>
        <pre style={{
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit',
          fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-primary)',
        }}>
          {lesson.content || 'No content available for this lesson.'}
        </pre>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-outline"
            onClick={() => navigate(`/app/programs/${programId}/lessons/${prevLesson.id}`)}
            disabled={!prevLesson}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '10px 16px', fontSize: '0.875rem', opacity: prevLesson ? 1 : 0.4, cursor: prevLesson ? 'pointer' : 'not-allowed' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate(`/app/programs/${programId}/lessons/${nextLesson.id}`)}
            disabled={!nextLesson}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '10px 16px', fontSize: '0.875rem', opacity: nextLesson ? 1 : 0.4, cursor: nextLesson ? 'pointer' : 'not-allowed' }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        {/* Mark complete */}
        {progressStatus !== 'completed' ? (
          <button
            className="btn-primary"
            onClick={handleMarkComplete}
            disabled={marking}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', opacity: marking ? 0.7 : 1 }}
          >
            <CheckCircle size={16} />
            {marking ? 'Saving...' : 'Mark as Complete'}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 600, fontSize: '0.875rem' }}>
            <CheckCircle size={16} /> Lesson completed
          </div>
        )}
      </div>
    </div>
  );
}
