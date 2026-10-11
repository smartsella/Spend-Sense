import axios from 'axios';

// Automatically detect API baseURL:
// 1. From VITE_API_URL if configured in .env
// 2. Default to local backend 'http://localhost:5000/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Token & preserve FormData boundary
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, delete Content-Type so browser sets correct multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  }
  let apiBase = API.defaults.baseURL ? API.defaults.baseURL.replace('/api', '') : 'http://localhost:5000';
  if (!apiBase.endsWith('/')) {
    apiBase += '/';
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${apiBase}${cleanPath}`;
};

export default API;
