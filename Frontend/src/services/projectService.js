import api from './api';

const projectService = {
  /**
   * Get all projects for the authenticated user
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search term
   * @param {string} params.status - Filter by status
   * @returns {Promise<{ projects: Array, pagination: Object }>}
   */
  getProjects: async (params = {}) => {
    const res = await api.get('/projects', { params });
    return res.data; // res is already unwrapped to { status, message, data }
  },

  /**
   * Get a single project by ID
   * @param {number} id - Project ID
   * @returns {Promise<Object>}
   */
  getProject: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  /**
   * Create a new project
   * @param {Object} payload - Project data
   * @param {string} payload.name - Project name (required)
   * @param {string} payload.description - Project description
   * @param {string} payload.category - Project category
   * @param {string} payload.dueDate - Project due date
   * @param {string} payload.status - Project status (Planning, In Progress, Completed)
   * @returns {Promise<Object>}
   */
  createProject: async (payload) => {
    const res = await api.post('/projects', payload);
    return res.data;
  },

  /**
   * Update a project
   * @param {number} id - Project ID
   * @param {Object} payload - Updated project data
   * @returns {Promise<Object>}
   */
  updateProject: async (id, payload) => {
    const res = await api.patch(`/projects/${id}`, payload);
    return res.data;
  },

  /**
   * Delete a project
   * @param {number} id - Project ID
   * @returns {Promise<void>}
   */
  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
  }
};

export default projectService;
