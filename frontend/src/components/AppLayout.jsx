import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart2,
  Map, Users, Calendar, FileText, Settings, LogOut, Shield,
  MessageSquare, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NAV_LINKS = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/assessments', icon: ClipboardList, label: 'Assessments' },
  { to: '/app/gap-analysis', icon: BarChart2, label: 'Gap Analysis' },
  { to: '/app/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/app/interview-prep', icon: MessageSquare, label: 'Interview Prep' },
  { to: '/app/mentors', icon: Users, label: 'Mentors' },
  { to: '/app/events', icon: Calendar, label: 'Events' },
  { to: '/app/blog', icon: FileText, label: 'Blog' },
];

const ADMIN_LINKS = [
  { to: '/app/admin/users', icon: Shield, label: 'Admin Users' },
];

export default function AppLayout() {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--accent-electric)' : '3px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 20,
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0 }} className="bg-gradient" />
          <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>LearningHub</span>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => linkStyle(isActive)}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {profile?.role === 'admin' && (
            <>
              <div style={{ margin: '16px 0 8px', padding: '0 8px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                Admin
              </div>
              {ADMIN_LINKS.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} style={({ isActive }) => linkStyle(isActive)}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 16px', borderRadius: '10px', border: 'none',
            background: 'transparent', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
            transition: 'all 0.2s ease', width: '100%',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          height: '60px', borderBottom: '1px solid var(--glass-border)',
          background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end', padding: '0 32px', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: 'white',
            }}>
              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {profile?.full_name || 'User'}
            </span>
            {profile?.role && (
              <span className={`badge ${profile.role === 'admin' ? 'badge-blue' : profile.role === 'mentor' ? 'badge-green' : 'badge-gray'}`}>
                {profile.role}
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
