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
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
  },

  logout: async () => {
    await supabaseSignOut();
    set({ user: null, profile: null });
  },
}));
