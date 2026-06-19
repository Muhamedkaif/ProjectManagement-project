/**
 * index.js — Central export for the service layer.
 *
 * Import any service from this single entry point:
 *   import { authService } from '@/services';
 * or
 *   import services from '@/services';
 *   services.auth.login(...)
 */

export { default as authService } from './authService';
export { default as projectService } from './projectService';
export { default as taskService } from './taskService';
// Re-export the raw api client for one-off or advanced usage
export { default as api } from './api';
export { getToken, setToken, clearToken, TOKEN_KEY } from './api';
