import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ph_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('ph_token');
        localStorage.removeItem('ph_user');
        window.location.href = '/login';
      }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const casesAPI = {
  getAll: (params) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  create: (data) => api.post('/cases', data),
  update: (id, data) => api.put(`/cases/${id}`, data),
  delete: (id) => api.delete(`/cases/${id}`),
};

export const analyticsAPI = {
  getData: (params) => api.get('/analytics/data', { params }),
  getReports: (params) => api.get('/analytics/reports', { params }),
  createReport: (data) => api.post('/analytics/reports', data),
};

export const workflowAPI = {
  getAll: (params) => api.get('/workflow', { params }),
  create: (data) => api.post('/workflow', data),
  updateStatus: (id, data) => api.put(`/workflow/${id}/status`, data),
  getAuditLog: (params) => api.get('/workflow/audit-log', { params }),
};

export const monitoringAPI = {
  getData: () => api.get('/monitoring'),
  acknowledgeAlert: (id) => api.put(`/monitoring/alerts/${id}/acknowledge`),
  createAlert: (data) => api.post('/monitoring/alerts', data),
};

export const executiveAPI = {
  getSummary: () => api.get('/executive'),
};

export const regionsAPI = {
  getAll: () => api.get('/regions'),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
