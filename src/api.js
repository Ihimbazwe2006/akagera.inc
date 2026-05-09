import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://akagerainc.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  googleAuth: (token) => api.post('/auth/google', { token }),
  getUser: (userId) => api.get(`/users/${userId}`),
  getUserByEmail: (email) => api.get(`/users/email/${email}`),
};

export const appAPI = {
  getAll: () => api.get('/apps'),
  getById: (id) => api.get(`/apps/${id}`),
  create: (appData) => api.post('/apps', appData),
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
};

export const paymentAPI = {
  createIntent: (userId, intentData) => 
    api.post(`/payments/create-intent?user_id=${userId}`, intentData),
  getUserPayments: (userId) => api.get(`/payments/user/${userId}`),
  handleWebhook: (webhookData) => api.post('/payments/webhook', webhookData),
};

export const licenseAPI = {
  getUserLicenses: (userId) => api.get(`/licenses/user/${userId}`),
  verifyLicense: (licenseKey) => api.get(`/licenses/verify/${licenseKey}`),
  generateLicense: (userId, serviceId) =>
    api.post(`/licenses/generate?user_id=${userId}&service_id=${serviceId}`),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export default api;
