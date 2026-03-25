import React, { useState } from 'react';
import { eventsData } from '../data/placeholders';
import { Calendar } from 'lucide-react';
import './EnhancedStyles.css';

export default function EventsEnhanced() {
  const [registered, setRegistered] = useState(new Set());

  const handleRegister = (id) => {
    setRegistered(prev => new Set([...prev, id]));
  };

  return (
    <div className="page animate-fade-in">
      <h1 className="page-title">Events</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Live webinars, workshops, and PM community events.
      </p>

      <div className="grid2">
        {eventsData.map((event) => {
          const isRegistered = registered.has(event.id);
          const opacity = event.isPast ? 0.6 : 1;
          
          return (
            <div 
              key={event.id} 
              className="card-placeholder" 
              style={{ opacity, display: 'flex', flexDirection: 'column' }}
            >
              <div 
                className="event-date" 
                style={event.isPast ? { background: 'rgba(148,163,184,0.1)', color: 'var(--text-secondary)' } : {}}
              >
                {event.dateText}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                {event.badges.map((badge, i) => (
                  <span 
                    key={i} 
                    className={`badge ${badge.class || ''}`} 
                    style={badge.inlineStyle || {}}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
              
              <div className="event-title">{event.title}</div>
              <div className="event-meta">{event.meta}</div>
              
              <div className="divider"></div>
              
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>
                {event.description}
              </div>
              
              {event.isPast ? (
                <button className="btn-sm" style={{ opacity: 0.5, cursor: 'default' }}>
                  {event.cta}
                </button>
              ) : isRegistered ? (
                <button className="btn-sm" style={{ color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)', cursor: 'default', background: 'rgba(34,197,94,0.05)' }}>
                  ✓ Registered
                </button>
              ) : (
                <button className="btn-sm" onClick={() => handleRegister(event.id)}>
                  {event.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
