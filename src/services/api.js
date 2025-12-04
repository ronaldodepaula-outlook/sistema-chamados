import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rdpsolutions.online/api-helpdesk/public/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  // Note: we intentionally do NOT enable `withCredentials` by default because
  // the API returns token-based authentication and the server currently responds
  // with Access-Control-Allow-Origin: * which is incompatible with credentials.
  // If you switch to cookie-based server sessions, enable `withCredentials: true`
  // and configure the server to return Access-Control-Allow-Credentials: true and
  // a specific Access-Control-Allow-Origin (not '*').
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;