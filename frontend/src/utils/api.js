import axios from 'axios';

// Base URL for API calls (without /api)
const configuredApiUrl = import.meta.env.VITE_API_URL || '';
export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  configuredApiUrl.replace(/\/api\/?$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '')
).replace(/\/$/, '');

export const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Cpath d="M120 280l55-65 40 45 30-35 55 55H120z" fill="%239ca3af"/%3E%3Ccircle cx="260" cy="145" r="28" fill="%239ca3af"/%3E%3C/svg%3E';

const api = axios.create({
  baseURL: configuredApiUrl || (BACKEND_URL ? `${BACKEND_URL}/api` : undefined),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return FALLBACK_IMAGE;
  
  // Handle if imageUrl is an object with url property
  if (typeof imageUrl === 'object') {
    imageUrl = imageUrl?.url || imageUrl?.[0]?.url || imageUrl?.[0] || '';
  }
  
  // Handle array
  if (Array.isArray(imageUrl)) {
    imageUrl = imageUrl[0]?.url || imageUrl[0] || '';
  }
  
  // Ensure it's a string
  if (typeof imageUrl !== 'string') {
    return FALLBACK_IMAGE;
  }

  const localhostPrefix = /^https?:\/\/localhost(?::\d+)?/i;
  if (localhostPrefix.test(imageUrl)) {
    imageUrl = imageUrl.replace(localhostPrefix, '');
  }
  
  // If it's already a non-local full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Resolve relative upload paths against the backend.
  return BACKEND_URL ? `${BACKEND_URL}/${imageUrl.replace(/^\/+/, '')}` : FALLBACK_IMAGE;
};

// Request interceptor to add auth token
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

// Response interceptor for error handling
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