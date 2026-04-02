import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  themeMode: 'toxic', // default meme mode

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setThemeMode: (mode) => set({ themeMode: mode }),

  checkUser: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, loading: false });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null });
    });
  },

  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signUp: async (email, password) => {
    return await supabase.auth.signUp({ email, password });
  },

  signOut: async () => {
    await supabase.auth.signOut();
  }
}));
