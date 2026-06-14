import axios from 'axios';

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  baseURL:"https://spend-sense-backend-1.onrender.com/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Token
API.interceptors.request.use(
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

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  }
  const apiBase = API.defaults.baseURL ? API.defaults.baseURL.replace('/api', '') : 'https://spend-sense-backend-1.onrender.com';
  return `${apiBase}${imagePath}`;
};

export default API;
