import api from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/login', { email, senha });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/user');
    return response.data;
  },

  async updateCurrentUser(userData) {
    // Some backends accept PUT/PATCH to /user for updating the currently authenticated user
    const response = await api.put('/user', userData);
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async requestPasswordReset(email) {
    const response = await api.post('/password/request', { email });
    return response.data;
  },

  async resetPassword(token, senha, senha_confirmation) {
    const response = await api.post('/password/reset', {
      token,
      senha,
      senha_confirmation
    });
    return response.data;
  }
};