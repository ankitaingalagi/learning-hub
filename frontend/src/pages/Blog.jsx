import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogPosts } from '../services/supabase';
import { FileText, ArrowRight } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getBlogPosts();
        if (fetchError) throw fetchError;
        setPosts(data || []);
      } catch (err) {
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Blog</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        PM insights, frameworks, and career advice from the community.
      </p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <FileText size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No blog posts yet.</p>
        </div>
      ) : (
        <div className="grid-2">
          {posts.map(post => (
            <div
              key={post.id}
              className="glass-panel"
              style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px', cursor: 'pointer' }}
              onClick={() => navigate(`/app/blog/${post.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)', flexShrink: 0 }}>
                  <FileText size={16} />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {(post.content || '').slice(0, 150)}{post.content?.length > 150 ? '...' : ''}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {post.profiles?.full_name && <span>{post.profiles.full_name} · </span>}
                  {formatDate(post.created_at)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-electric)', fontSize: '0.8rem', fontWeight: 600 }}>
                  Read <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
