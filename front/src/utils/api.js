import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contratosApi = {
  getAll: (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    for (const [key, value] of params.entries()) {
      if (!value) params.delete(key);
    }
    return api.get(`/contratos?${params.toString()}`);
  },
  getById: (id) => api.get(`/contratos/${id}`),
  create: (data) => api.post('/contratos', data),
  update: (id, data) => api.put(`/contratos/${id}`, data),
  remove: (id) => api.delete(`/contratos/${id}`),
  reenviar: (id) => api.post(`/contratos/${id}/reenviar`),
  firmar: (id) => api.patch(`/contratos/${id}/firmar`),
  cancelar: (id) => api.patch(`/contratos/${id}/cancelar`),
};

export default api;
