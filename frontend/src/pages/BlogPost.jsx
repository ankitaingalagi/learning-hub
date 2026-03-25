import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPost } from '../services/supabase';
import { blogData } from '../data/placeholders';
import { ChevronLeft, Calendar, User } from 'lucide-react';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      
      // 1. Check local placeholders first
      const localMatch = blogData.find(b => b.id === id);
      if (localMatch) {
        setPost({
          title: localMatch.title,
          content: localMatch.content || localMatch.preview,
          created_at: new Date().toISOString(),
          profiles: { full_name: localMatch.authorName }
        });
        setLoading(false);
        return;
      }

      // 2. Fallback to Supabase Database
      try {
        const { data, error: fetchError } = await getBlogPost(id);
        if (fetchError) throw fetchError;
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page">
        <div style={{ color: '#f87171' }}>{error || 'Post not found.'}</div>
        <button className="btn-outline" onClick={() => navigate('/app/blog')} style={{ marginTop: '16px' }}>
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1, maxWidth: '760px' }}>
      {/* Back */}
      <button
        className="btn-outline"
        onClick={() => navigate('/app/blog')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px', borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
      >
        <ChevronLeft size={16} /> Back to Blog
      </button>

      {/* Title */}
      <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>{post.title}</h1>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', flexWrap: 'wrap' }}>
        {post.profiles?.full_name && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={14} /> {post.profiles.full_name}
          </span>
        )}
        {post.created_at && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} /> {formatDate(post.created_at)}
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '32px' }} />

      {/* Content */}
      <div className="glass-panel" style={{ padding: '36px', opacity: 1, transform: 'none' }}>
        <pre style={{
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit',
          fontSize: '0.975rem', lineHeight: 1.9, color: 'var(--text-primary)',
        }}>
          {post.content || 'No content.'}
        </pre>
      </div>
    </div>
  );
}
