import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getEvents, registerForEvent, getMyEventRegistrations } from '../services/supabase';
import { Calendar, ExternalLink, CheckCircle } from 'lucide-react';

export default function Events() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [registering, setRegistering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [eventsRes, regRes] = await Promise.all([
          getEvents(),
          getMyEventRegistrations(user.id),
        ]);
        if (eventsRes.error) throw eventsRes.error;
        setEvents(eventsRes.data || []);
        setRegisteredIds(new Set((regRes.data || []).map(r => r.event_id)));
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      const { error: regError } = await registerForEvent(user.id, eventId);
      if (regError) throw regError;
      setRegisteredIds(prev => new Set([...prev, eventId]));
    } catch (err) {
      alert(err.message || 'Registration failed.');
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading events...</div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Events</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Live webinars, workshops, and PM community events.
      </p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No upcoming events.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {events.map(event => {
            const registered = registeredIds.has(event.id);
            const isPast = event.start_time && new Date(event.start_time) < new Date();
            return (
              <div key={event.id} className="glass-panel" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', opacity: 1, transform: 'none' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{event.title}</h3>
                    {isPast && <span className="badge badge-gray">Past</span>}
                  </div>
                  {event.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '10px', lineHeight: 1.5 }}>
                      {event.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <Calendar size={13} />
                    {formatDate(event.start_time)}
                  </div>
                  {event.url && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-electric)', fontSize: '0.8rem', textDecoration: 'none', marginTop: '6px' }}>
                      <ExternalLink size={12} /> Join Link
                    </a>
                  )}
                </div>

                {!isPast && (
                  registered ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                      <CheckCircle size={16} /> Registered
                    </div>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => handleRegister(event.id)}
                      disabled={registering === event.id}
                      style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', whiteSpace: 'nowrap', opacity: registering === event.id ? 0.7 : 1 }}
                    >
                      {registering === event.id ? 'Registering...' : 'Register'}
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
