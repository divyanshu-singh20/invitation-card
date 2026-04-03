import axios from 'axios';

// Base URL for API calls (without /api)
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x400?text=No+Image';
  
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
    return 'https://via.placeholder.com/400x400?text=No+Image';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL starting with /uploads
  if (imageUrl.startsWith('/uploads')) {
    return `${BACKEND_URL}${imageUrl}`;
  }
  
  return imageUrl;
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