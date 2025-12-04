import api from './api';

export const logsService = {
  async getAll() {
    const response = await api.get('/logs');
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/logs/${id}`);
    return response.data;
  }
};

export default logsService;
