import { useEffect, useState } from 'react';
import { getAllProfiles } from '../../services/supabase';
import { Users, Search } from 'lucide-react';

const ROLE_BADGE = {
  admin: 'badge-blue',
  mentor: 'badge-green',
  learner: 'badge-gray',
};

export default function AdminUsers() {
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getAllProfiles();
        if (fetchError) throw fetchError;
        setProfiles(data || []);
        setFiltered(data || []);
      } catch (err) {
        setError('Failed to load users. (RLS may require admin privileges.)');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(profiles.filter(p =>
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.role || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q)
    ));
  }, [search, profiles]);

  return (
    <div className="page animate-fade-in" style={{ opacity: 1 }}>
      <h1 className="page-title">Admin — Users</h1>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading users...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', opacity: 1, transform: 'none' }}>
          <Users size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {search ? 'No users match your search.' : 'No users found.'}
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden', opacity: 1, transform: 'none' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2fr 1fr',
            padding: '14px 24px', background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid var(--glass-border)',
            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)',
          }}>
            <span>User ID</span>
            <span>Full Name</span>
            <span>Role</span>
          </div>

          {/* Table rows */}
          {filtered.map((profile, idx) => (
            <div
              key={profile.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr 1fr',
                padding: '16px 24px', alignItems: 'center',
                borderBottom: idx < filtered.length - 1 ? '1px solid var(--glass-border)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.id}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'white',
                }}>
                  {profile.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <span style={{ fontWeight: 500 }}>{profile.full_name || '—'}</span>
              </div>
              <span>
                <span className={`badge ${ROLE_BADGE[profile.role] || 'badge-gray'}`}>
                  {profile.role || 'learner'}
                </span>
              </span>
            </div>
          ))}

          {/* Footer */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--glass-border)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} of {profiles.length} users
          </div>
        </div>
      )}
    </div>
  );
}
