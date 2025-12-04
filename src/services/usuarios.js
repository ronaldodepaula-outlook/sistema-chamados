import api from './api';

export const usuariosService = {
  async getAll() {
    const response = await api.get('/usuarios');
    const data = response.data;
    // Normalize response to array form to avoid runtime errors in components
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.usuarios)) return data.usuarios;
    // If server returned 204 or empty object, return empty array
    if (!data) return [];
    // If it's an object representing a single user, return it inside an array
    if (data && typeof data === 'object') return [data];
    return [];
  },

  async getById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async create(usuarioData) {
    const response = await api.post('/usuarios', usuarioData);
    return response.data;
  },

  async update(id, usuarioData) {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};

export default usuariosService;
