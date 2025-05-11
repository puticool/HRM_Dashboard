import axios from 'axios';

// API base URL
export const API_URL = "https://ba64-2001-ee0-4b74-f010-fdad-87bd-ad0e-8e02.ngrok-free.app";

// Helper to format data as form-urlencoded
const formatFormData = (data) => {
  const formData = new URLSearchParams();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
    if (tokens.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
        
        if (tokens.refresh_token) {
          // Try to refresh the token
          const formData = formatFormData({ refresh_token: tokens.refresh_token });
          
          const response = await axios.post(`${API_URL}/auth/refresh`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          
          // If token refresh was successful
          if (response.data && response.data.access_token) {
            // Update tokens in localStorage
            localStorage.setItem("tokens", JSON.stringify(response.data));
            
            // Update the Authorization header
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            
            // Retry the original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Force logout by clearing tokens
        localStorage.removeItem("tokens");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (username, password) => {
    const formData = formatFormData({ username, password });
    return api.post('/auth/token', formData);
  },
  register: (username, password, name) => {
    const formData = formatFormData({ username, password, name });
    return api.post('/auth/register', formData);
  },
  refreshToken: (refreshToken) => {
    const formData = formatFormData({ refresh_token: refreshToken });
    return api.post('/auth/refresh', formData);
  },
  logout: () => api.post('/auth/logout')
};

export default api; 