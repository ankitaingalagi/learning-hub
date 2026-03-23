import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMentors, bookSession } from '../services/supabase';
import { Users, X, Calendar } from 'lucide-react';

function BookingModal({ mentor, userId, onClose, onBooked }) {
  const [startTime, setStartTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBook = async (e) => {
    e.preventDefault();
    if (!startTime) return;
    setLoading(true);
    setError('');
    try {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
      const { error: bookError } = await bookSession(mentor.id, userId, start.toISOString(), end.toISOString());
      if (bookError) throw bookError;
      onBooked();
      onClose();
    } catch (err) {
      setError(err.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px',
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px', position: 'relative', opacity: 1, transform: 'none' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Book a Session</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
          with <strong style={{ color: 'var(--text-primary)' }}>{mentor.profiles?.full_name || 'Mentor'}</strong> — 1 hour session
        </p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Select Date & Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ borderRadius: '10px', padding: '12px', fontSize: '0.9rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Mentors() {
  const { user } = useAuthStore();
  const [mentors, setMentors] = useState([]);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [bookedIds, setBookedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getMentors();
        if (fetchError) throw fetchError;
        setMentors(data || []);
      } catch (err) {
        setError('Failed to load mentors.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading mentors...</div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Mentors</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Book 1-on-1 sessions with experienced Product Managers.
      </p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {mentors.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <Users size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No mentors available yet.</p>
        </div>
      ) : (
        <div className="grid-2">
          {mentors.map(mentor => (
            <div key={mentor.id} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 700, color: 'white',
                }}>
                  {mentor.profiles?.full_name?.[0]?.toUpperCase() || 'M'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{mentor.profiles?.full_name || 'Mentor'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Product Manager</div>
                </div>
              </div>

              {/* Bio */}
              {mentor.bio && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {mentor.bio.slice(0, 180)}{mentor.bio.length > 180 ? '...' : ''}
                </p>
              )}

              {/* Expertise tags */}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {mentor.expertise.map((tag, idx) => (
                    <span key={idx} className="badge badge-blue">{tag}</span>
                  ))}
                </div>
              )}

              {/* Book button */}
              <button
                className="btn-primary"
                onClick={() => setBookingMentor(mentor)}
                style={{ borderRadius: '10px', padding: '11px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}
              >
                <Calendar size={16} /> Book Session
              </button>
            </div>
          ))}
        </div>
      )}

      {bookingMentor && (
        <BookingModal
          mentor={bookingMentor}
          userId={user?.id}
          onClose={() => setBookingMentor(null)}
          onBooked={() => setBookedIds(prev => new Set([...prev, bookingMentor.id]))}
        />
      )}
    </div>
  );
}
