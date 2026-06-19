import api from './api';

const taskService = {
  getTasks: async (params = {}) => {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  getTask: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (payload) => {
    const res = await api.post('/tasks', payload);
    return res.data;
  },

  updateTask: async (id, payload) => {
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
  }
};

export default taskService;
