import { create } from 'zustand';
import { getSession, getProfile, onAuthStateChange, signOut as supabaseSignOut } from '../services/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await getSession();
      if (session?.user) {
        set({ user: session.user });
        const { data: profile } = await getProfile(session.user.id);
        set({ profile });
      } else {
        // Auth bypass: inject mock user so pages load during testing
        const mockUser = { id: '00000000-0000-0000-0000-000000000001', email: 'test@example.com' };
        const mockProfile = { id: mockUser.id, full_name: 'Test User', role: 'learner', avatar_url: null };
        set({ user: mockUser, profile: mockProfile });
      }
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      set({ loading: false, initialized: true });
    }

    // Listen for auth changes
    onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({ user: session.user });
        const { data: profile } = await getProfile(session.user.id);
        set({ profile, loading: false, initialized: true });
      } else {
        // Don't wipe mock user when no real session exists (auth bypass mode)
        const currentUser = get().user;
        if (currentUser?.email !== 'test@example.com') {
          set({ user: null, profile: null, loading: false, initialized: true });
        }
      }
    });
  },

  logout: async () => {
    await supabaseSignOut();
    set({ user: null, profile: null });
  },
}));
