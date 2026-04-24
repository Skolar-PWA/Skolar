import type { AuthenticatedUser, LoginResponse } from '@eduportal/shared';
import { api, setAccessToken, unwrap } from './client';

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const res = await unwrap<LoginResponse>(
      api.post('/auth/login', { identifier, password }),
    );
    setAccessToken(res.accessToken);
    return res;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => undefined);
    setAccessToken(null);
  },
  async me(): Promise<AuthenticatedUser> {
    return unwrap<AuthenticatedUser>(api.get('/auth/me'));
  },
  async refresh(): Promise<{ accessToken: string; expiresIn: number }> {
    return unwrap<{ accessToken: string; expiresIn: number }>(api.post('/auth/refresh'));
  },
};
