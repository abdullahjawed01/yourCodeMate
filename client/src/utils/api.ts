import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Extend the config type to support silentFail
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    silentFail?: boolean;
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
// Uses `silentFail: true` config to avoid redirecting on background/non-critical API calls
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      const config = error.config as InternalAxiosRequestConfig;
      // Only auto-redirect if this is a critical auth failure (not a background call)
      if (!config?.silentFail) {
        const url = config?.url || '';
        // Only the auth identity calls are "critical" enough to force a logout +
        // redirect. Match them precisely — a broad `includes('/me')` also caught
        // endpoints like `/leaderboard/me`, causing spurious logouts when an
        // unrelated route returned 401.
        const path = url.split('?')[0];
        const isCritical = path === '/me' || path.endsWith('/auth/me') || path.startsWith('/auth');
        if (isCritical) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
