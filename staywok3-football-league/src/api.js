import axios from 'axios';

const api = axios.create({
  baseURL: 'https://44.211.63.151:5000/api' || 'http://localhost:5000/api',
});

// Add token to Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
