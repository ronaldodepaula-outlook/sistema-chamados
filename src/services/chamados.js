import api from './api';

export const chamadosService = {
  async getAll() {
    const response = await api.get('/chamados');
    const data = response.data;
    // Normalize various API payload shapes to an array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.chamados)) return data.chamados;
    if (Array.isArray(data?.items)) return data.items;
    // If response is an object but not array, return as single-element array
    if (data && typeof data === 'object') return [data];
    return [];
  },

  async getById(id) {
    const response = await api.get(`/chamados/${id}`);
    const data = response.data;
    // normalize payload shapes
    let item = null;
    if (!data) item = null;
    else if (data && typeof data === 'object' && !Array.isArray(data)) {
      // common wrappers
      if (data.data && typeof data.data === 'object') item = data.data;
      else if (data.chamado && typeof data.chamado === 'object') item = data.chamado;
      else item = data;
    } else if (Array.isArray(data)) {
      // sometimes API returns array even for single
      item = data[0] || null;
    }

    if (!item) return null;

    // normalize field names and dates for frontend
    const normalized = {
      id: item.id,
      titulo: item.titulo || item.title || '',
      descricao: item.descricao || item.description || '',
      cliente_id: item.cliente_id || item.clienteId || item.customer_id || null,
      status: item.status || 'aberto',
      created_at: item.created_at || item.criado_em || item.createdAt || null,
      updated_at: item.updated_at || item.atualizado_em || item.updatedAt || null,
      raw: item
    };

    return normalized;
  },

  async create(chamadoData) {
    const response = await api.post('/chamados', chamadoData);
    return response.data;
  },

  async update(id, chamadoData) {
    const response = await api.put(`/chamados/${id}`, chamadoData);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/chamados/${id}`, { status });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/chamados/${id}`);
    return response.data;
  }
};

export const clientesService = {
  async getAll() {
    const response = await api.get('/clientes');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.clientes)) return data.clientes;
    return Array.isArray(data) ? data : [];
  },

  async getById(id) {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(clienteData) {
    const response = await api.post('/clientes', clienteData);
    return response.data;
  },

  async update(id, clienteData) {
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  }
};

export const comentariosService = {
  async getAll() {
    const response = await api.get('/comentarios');
    return response.data;
  },

  async getByChamadoId(chamadoId) {
    // Some backends expose comments under /chamados/:id/comentarios with pagination
    const response = await api.get(`/chamados/${chamadoId}/comentarios`);
    const data = response.data;
    // If paginated, the comments are in data.data
    let list = [];
    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data?.data)) list = data.data;
    else if (Array.isArray(data?.comentarios)) list = data.comentarios;
    else if (data && typeof data === 'object') list = [data];

    // Normalize each comment to expected frontend fields (conteudo & created_at)
    // remove duplicates (by id) and normalize
    const seen = new Set();
    const unique = [];
    for (const c of list) {
      if (c && c.id && !seen.has(c.id)) {
        seen.add(c.id);
        unique.push(c);
      }
    }

    return unique.map(c => ({
      id: c.id,
      chamado_id: c.chamado_id,
      usuario_id: c.usuario_id,
      usuario: c.usuario || c.user || null,
      conteudo: c.conteudo || c.mensagem || c.mensagem_text || '',
      created_at: c.created_at || c.criado_em || c.createdAt || null,
      raw: c
    }));
  },

  async create(comentarioData) {
    // Backend may expect 'mensagem' instead of 'conteudo' — support both
    const payload = {
      ...comentarioData,
      mensagem: comentarioData.conteudo || comentarioData.mensagem || comentarioData.text || ''
    };
    const response = await api.post('/comentarios', payload);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/comentarios/${id}`);
    return response.data;
  }
};