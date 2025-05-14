import axios from 'axios';

// API base URL
export const API_URL = "https://d9b7-2001-ee0-4b74-f010-d468-6b13-84e9-c52b.ngrok-free.app";

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
    'Content-Type': 'application/x-www-form-urlencoded',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token") || "";
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
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
        const refresh_token = localStorage.getItem("refresh_token") || "";
        
        if (refresh_token) {
          // Try to refresh the token
          const formData = formatFormData({ refresh_token: refresh_token });
          
          const response = await axios.post(`${API_URL}/auth/refresh`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          
          // If token refresh was successful
          if (response.data && response.data.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            
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
  logout: () => api.post('/auth/logout'),
};

export default api; 