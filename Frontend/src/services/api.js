/**
 * api.js — Axios instance for the ProjectFlow frontend.
 *
 * The base URL can be configured with VITE_API_BASE_URL.
 * Falls back to /api for Vite proxy-based development.
 *
 * Request interceptor  → attaches the stored JWT token as a Bearer header.
 * Response interceptor → unwraps the Axios envelope and normalises errors.
 */

import axios from 'axios';

// ─── token helpers ────────────────────────────────────────────────────────────

export const TOKEN_KEY = 'pf_token';

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? null;

export const setToken = (token, remember = false) => {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: 'https://projectmanagement-project.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,                        // 10 s timeout
  withCredentials: false,                 // flip to true if you switch to cookie-based auth
});

// ─── Request interceptor — attach JWT ────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — unwrap data / normalise errors ───────────────────

api.interceptors.response.use(
  // On 2xx: return response.data directly so callers get { status, message, data }
  (response) => response.data,

  // On 4xx/5xx: throw a plain Error with the backend's message
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    const err = new Error(message);
    err.status = error.response?.status;
    err.data   = error.response?.data;

    return Promise.reject(err);
  }
);

export default api;
