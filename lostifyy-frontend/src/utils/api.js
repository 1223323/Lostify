import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const url = config.url || '';
    const isPublicAuthEndpoint =
      url.includes('/api/auth/login') ||
      url.includes('/api/auth/register');

    // Attach token for all endpoints except public auth endpoints
    if (token && !isPublicAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData (multipart/form-data)
    // The browser will set it automatically with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
// Simple in-module guard to avoid multiple redirects
let isRedirectingToLogin = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Handle different error status codes
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Do not treat 401s from public auth endpoints as global auth failures
      const isPublicAuthEndpoint =
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/register');

      if (!isPublicAuthEndpoint) {
        // Clear the invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('selectedUniversityId');
        delete api.defaults.headers.common['Authorization'];
        
        // Only redirect if we're not already on the login page and not already redirecting
        const onLoginPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
        if (!onLoginPage && !isRedirectingToLogin) {
          isRedirectingToLogin = true;
          // Store the current location to redirect back after login
          const returnTo = window.location.pathname + window.location.search;
          window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
        }
      }
    } else if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api; 