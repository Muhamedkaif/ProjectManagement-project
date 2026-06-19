/**
 * authService.js — Authentication service layer.
 *
 * All /api/auth/* calls go through the Axios instance in api.js.
 * The response interceptor already unwraps axios → response.data,
 * so callers receive { status, message, data } directly.
 */

import api, { clearToken, setToken } from './api';

const authService = {
  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} payload
   * @returns {Promise<{ token: string, user: object }>}
   */
  register: async ({ name, email, password}) => {
    const res = await api.post('/auth/register', { name, email, password});
    // res = { status, message, data: { token, user } }
    return res.data;
  },

  /**
   * Log in with email + password.
   * Automatically persists the JWT token.
   * @param {{ email: string, password: string, remember?: boolean }} payload
   * @returns {Promise<{ token: string, user: object }>}
   */
  login: async ({ email, password, remember = false }) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token, remember);
    return res.data;
  },

  /**
   * Log out the current user.
   * Clears the stored token regardless of the server response.
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // always wipe the token, even if the network call fails
      clearToken();
    }
  },

  /**
   * Fetch the currently authenticated user's profile.
   * Requires a valid token to be stored.
   * @returns {Promise<{ user: object }>}
   */
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export default authService;
