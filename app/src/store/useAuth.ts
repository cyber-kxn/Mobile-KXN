import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';

export interface User {
  id: string;
  handle: string;
  email: string;
  avatarSeed: string;
  onboarded: boolean;
  interests: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (handle: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (interests: string[]) => void;
}

/** Mock auth used when the API is offline — keeps the app fully usable. */
function mockUser(handle: string, email: string): User {
  return {
    id: 'local-' + Math.random().toString(36).slice(2, 8),
    handle,
    email,
    avatarSeed: handle,
    onboarded: false,
    interests: [],
  };
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        const res = await apiFetch<{ token: string; user: User }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (res.online && res.data) {
          localStorage.setItem('nethex.token', res.data.token);
          set({ user: res.data.user, token: res.data.token, loading: false });
          return true;
        }
        // Offline fallback
        const handle = email.split('@')[0] || 'operator';
        const user = { ...mockUser(handle, email), onboarded: true };
        set({ user, token: 'mock', loading: false });
        return true;
      },

      register: async (handle, email, password) => {
        set({ loading: true });
        const res = await apiFetch<{ token: string; user: User }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ handle, email, password }),
        });
        if (res.online && res.data) {
          localStorage.setItem('nethex.token', res.data.token);
          set({ user: res.data.user, token: res.data.token, loading: false });
          return true;
        }
        set({ user: mockUser(handle, email), token: 'mock', loading: false });
        return true;
      },

      logout: () => {
        localStorage.removeItem('nethex.token');
        set({ user: null, token: null });
      },

      completeOnboarding: (interests) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, onboarded: true, interests } });
      },
    }),
    { name: 'nethex.auth' },
  ),
);
