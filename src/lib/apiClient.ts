import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * Central API base URL for the VV Studio website backend.
 *
 * Override per environment with `VITE_API_BASE_URL` (e.g. in `.env`,
 * `.env.production`). Falls back to the demo host from the Postman
 * collection (`Website.postman_collection.json`).
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'https://agsdemo.in/vvsapi/public/api';

/** Normalised error thrown by {@link apiClient} for failed requests. */
export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string | number;

  constructor(message: string, status?: number, code?: string | number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface ErrorPayload {
  message?: string;
  code?: string | number;
}

/** Extract a human-readable message from an axios failure. */
export function toApiError(error: AxiosError<ErrorPayload>): ApiError {
  const status = error.response?.status;
  const data = error.response?.data;
  const message =
    (typeof data?.message === 'string' && data.message) ||
    error.message ||
    'Something went wrong. Please try again.';
  const code = data?.code;
  return new ApiError(message, status, code);
}

/**
 * Centralized axios instance — import this everywhere instead of
 * creating new axios instances or using fetch directly.
 *
 * - `baseURL` comes from `VITE_API_BASE_URL` (fallback: {@link API_BASE_URL}).
 * - Always sends `Accept: application/json` so the Laravel backend
 *   returns JSON errors instead of HTML pages.
 * - Lets the browser set `Content-Type` for `FormData` bodies
 *   (`createEnquiry` / `createNewsletter` accept form-data per Postman).
 * - Rejects with {@link ApiError} (has `.status` / `.code`).
 *
 * Usage:
 *   import { apiClient } from '@/lib/apiClient';
 *   const { data } = await apiClient.get('/getCompany');
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set('Accept', 'application/json');
    if (config.data instanceof FormData) {
      // Let the browser set multipart boundary.
      config.headers.delete('Content-Type');
    } else if (!config.headers.has('Content-Type') && config.data !== undefined) {
      config.headers.set('Content-Type', 'application/json');
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorPayload>) => Promise.reject(toApiError(error)),
);

export default apiClient;
