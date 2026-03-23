import { useEffect, useState } from 'react';
import { getPrograms, getProgram, createProgram, createModule, createLesson, deleteProgram } from '../../services/supabase';
import { Plus, Trash2, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

function AddModuleForm({ programId, onAdded }) {
  const [title, setTitle] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: err } = await createModule(programId, title, orderIndex);
      if (err) throw err;
      setTitle('');
      setOrderIndex(1);
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '16px', background: 'rgba(59,130,246,0.04)', borderRadius: '8px', marginTop: '8px' }}>
      {error && <div style={{ width: '100%', color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}
      <input type="text" placeholder="Module title" value={title} onChange={e => setTitle(e.target.value)} required style={{ flex: 2, minWidth: '180px' }} />
      <input type="number" placeholder="Order" value={orderIndex} onChange={e => setOrderIndex(Number(e.target.value))} min={1} style={{ width: '80px' }} />
      <button type="submit" className="btn-primary" disabled={loading} style={{ borderRadius: '8px', padding: '10px 16px', fontSize: '0.85rem' }}>
        {loading ? '...' : 'Add Module'}
      </button>
    </form>
  );
}

function AddLessonForm({ moduleId, onAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: err } = await createLesson(moduleId, title, content);
      if (err) throw err;
      setTitle('');
      setContent('');
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(139,92,246,0.04)', borderRadius: '8px', marginTop: '8px' }}>
      {error && <div style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}
      <input type="text" placeholder="Lesson title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Lesson content" value={content} onChange={e => setContent(e.target.value)} rows={4} style={{ resize: 'vertical' }} />
      <button type="submit" className="btn-primary" disabled={loading} style={{ borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
        {loading ? '...' : 'Add Lesson'}
      </button>
    </form>
  );
}

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showAddModule, setShowAddModule] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await getPrograms();
      if (err) throw err;
      setPrograms(data || []);
    } catch (err) {
      setError('Failed to load programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPrograms(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { error: err } = await createProgram(newTitle, newDesc);
      if (err) throw err;
      setNewTitle('');
      setNewDesc('');
      loadPrograms();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (programId) => {
    if (!confirm('Delete this program and all its content?')) return;
    try {
      const { error: err } = await deleteProgram(programId);
      if (err) throw err;
      loadPrograms();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Admin — Programs</h1>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Add Program form */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', opacity: 1, transform: 'none' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New Program
        </h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Program title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
          <textarea placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
          <button type="submit" className="btn-primary" disabled={creating} style={{ alignSelf: 'flex-start', borderRadius: '8px', padding: '10px 24px' }}>
            {creating ? 'Creating...' : 'Create Program'}
          </button>
        </form>
      </div>

      {/* Programs table */}
      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : programs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <BookOpen size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No programs yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {programs.map(program => (
            <div key={program.id} className="glass-panel" style={{ overflow: 'hidden', opacity: 1, transform: 'none' }}>
              {/* Program row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [program.id]: !prev[program.id] }))}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                  >
                    {expanded[program.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  <div>
                    <div style={{ fontWeight: 700 }}>{program.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{program.description?.slice(0, 80) || 'No description'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowAddModule(prev => ({ ...prev, [program.id]: !prev[program.id] }))}
                    className="btn-outline"
                    style={{ borderRadius: '8px', padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Module
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {showAddModule[program.id] && (
                <div style={{ padding: '0 24px 16px' }}>
                  <AddModuleForm programId={program.id} onAdded={() => { setShowAddModule(prev => ({ ...prev, [program.id]: false })); loadPrograms(); }} />
                </div>
              )}

              {expanded[program.id] && (
                <div style={{ borderTop: '1px solid var(--glass-border)', padding: '16px 24px' }}>
                  <ProgramModules programId={program.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramModules({ programId }) {
  const [modules, setModules] = useState([]);
  const [showAddLesson, setShowAddLesson] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await getProgram(programId);
    setModules(data?.modules || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [programId]);

  if (loading) return <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading modules...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {modules.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No modules yet. Use "Add Module" to create one.</p>
      ) : (
        modules.map(module => (
          <div key={module.id} style={{ border: '1px solid var(--glass-border)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{module.title}</span>
              <button
                onClick={() => setShowAddLesson(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                className="btn-outline"
                style={{ borderRadius: '6px', padding: '5px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Lesson
              </button>
            </div>
            {(module.lessons || []).map(lesson => (
              <div key={lesson.id} style={{ padding: '10px 16px', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-electric)', flexShrink: 0 }} />
                {lesson.title}
              </div>
            ))}
            {showAddLesson[module.id] && (
              <div style={{ padding: '0 16px 12px' }}>
                <AddLessonForm moduleId={module.id} onAdded={() => { setShowAddLesson(prev => ({ ...prev, [module.id]: false })); load(); }} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
