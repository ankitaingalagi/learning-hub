import React from 'react';
import { useNavigate } from 'react-router-dom';
import { blogData } from '../data/placeholders';
import { ArrowRight } from 'lucide-react';
import './EnhancedStyles.css';

export default function BlogEnhanced() {
  const navigate = useNavigate();

  return (
    <div className="page animate-fade-in">
      <h1 className="page-title">Blog</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        PM insights, frameworks, and career advice from the community.
      </p>

      <div className="grid2">
        {blogData.map((post) => (
          <div 
            key={post.id} 
            className="card-placeholder" 
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => navigate(`/app/blog/${post.id}`)}
          >
            <div className="blog-img">{post.emoji}</div>
            
            <div style={{ alignSelf: 'flex-start' }}>
              <span className={`blog-cat ${post.catClass}`}>{post.category}</span>
            </div>
            
            <div className="blog-title">{post.title}</div>
            <div className="blog-preview">{post.preview}</div>
            
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <div className="blog-author">
                <div className={`av-sm ${post.authorAvatarClass}`}>{post.authorInitials}</div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{post.authorName}</span>
                <span className="read-time" style={{ marginLeft: 'auto' }}>{post.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
