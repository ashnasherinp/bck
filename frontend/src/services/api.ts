// //frontend/src/services/api.ts


import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('[api.ts] Request:', config.url, 'Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[api.ts] No token found for request:', config.url);
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('[api.ts] FormData request detected, removed Content-Type header');
    }
    return config;
  },
  (error) => {
    console.error('[api.ts] Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('[api.ts] Response:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('[api.ts] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

console.log('[api.ts] API baseURL:', process.env.REACT_APP_API_URL);
export default api;