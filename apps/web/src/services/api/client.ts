import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiResponse } from '@eduportal/shared';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await axios.post<ApiResponse<{ accessToken: string; expiresIn: number }>>(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      if (res.data.success) {
        accessToken = res.data.data.accessToken;
        return accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as (typeof err.config & { _retry?: boolean }) | undefined;
    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return api.request(original);
      }
    }
    return Promise.reject(err);
  },
);

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.error.message);
}

export async function unwrapPaged<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<{ data: T; meta: Record<string, unknown> | undefined }> {
  const res = await promise;
  if (res.data.success) return { data: res.data.data, meta: res.data.meta as Record<string, unknown> | undefined };
  throw new Error(res.data.error.message);
}
