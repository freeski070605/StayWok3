import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:4040/api',
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
