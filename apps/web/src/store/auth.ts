import { create } from 'zustand';
import type { AuthenticatedUser } from '@eduportal/shared';
import { authService } from '../services/api/auth.service';
import { setAccessToken } from '../services/api/client';

interface AuthState {
  user: AuthenticatedUser | null;
  hydrating: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrating: true,
  async login(identifier, password) {
    const res = await authService.login(identifier, password);
    set({ user: res.user, hydrating: false });
  },
  async logout() {
    await authService.logout();
    setAccessToken(null);
    set({ user: null, hydrating: false });
  },
  async hydrate() {
    try {
      const refreshed = await authService.refresh();
      setAccessToken(refreshed.accessToken);
      const me = await authService.me();
      set({ user: me, hydrating: false });
    } catch {
      set({ user: null, hydrating: false });
    }
  },
}));
