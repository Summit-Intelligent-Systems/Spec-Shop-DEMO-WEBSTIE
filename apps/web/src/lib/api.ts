import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import type { ApiResponse, ApiError } from '@nayan-sukh-eyewear/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // For httpOnly cookie refresh tokens
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    // Attach access token from Zustand store
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracing
    if (config.headers) {
      config.headers['X-Request-ID'] = crypto.randomUUID();
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Auto-refresh token on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response.data?.code === 'AUTH_004') {
        // Token expired — try refresh
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
          const newToken = data.data.accessToken;
          useAuthStore.getState().setToken(newToken);
          onRefreshed(newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch {
          // Refresh failed — log out
          useAuthStore.getState().logout();
          toast.error('Session expired. Please log in again.');
          window.location.href = '/';
        } finally {
          isRefreshing = false;
        }
      }

      // Other 401 — not expired, just unauthorized
      useAuthStore.getState().logout();
    }

    // Surface error messages to the user (optional — can be per-component)
    const errorMessage = error.response?.data?.message || 'Something went wrong';

    // Don't show toast for 401 (handled above) or 404 (handled in components)
    if (error.response?.status && ![401, 404].includes(error.response.status)) {
      if (typeof window !== 'undefined' && !originalRequest._retry) {
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  },
);

// ─── Typed API Methods ────────────────────────────────────────────────────────

export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url, config);
  return response.data.data;
};

export const apiPost = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.post<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

export const apiPut = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.put<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

export const apiPatch = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.patch<ApiResponse<T>>(url, data, config);
  return response.data.data;
};

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete<ApiResponse<T>>(url, config);
  return response.data.data;
};

export default api;
