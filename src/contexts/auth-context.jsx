import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/utils/api";
import PropTypes from "prop-types";

const AuthContext = createContext({
  login: () => {},
  register: () => {},
  logout: () => {},
  refreshToken: () => {},
  isLoading: false,
  isAuthenticated: false,
  tokens: null
});

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for saved auth data in localStorage on initial load
  useEffect(() => {
    const savedTokens = localStorage.getItem("tokens");
    
    if (savedTokens) {
      setTokens(JSON.parse(savedTokens));
    }
    
    setIsLoading(false);
  }, []);
  
  // Function to save token data
  const saveTokenData = (tokenData) => {
    setTokens(tokenData);
    localStorage.setItem("tokens", JSON.stringify(tokenData));
  };
  
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      // Call login API using authService
      const response = await authService.login(username, password);
      
      // Check if the response has token data
      if (response.data && response.data.access_token && response.data.refresh_token) {
        // Save token data directly from response
        const tokenData = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          token_type: response.data.token_type || "bearer"
        };
        
        // Save token data
        saveTokenData(tokenData);
        
        return { success: true };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Login failed" 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (username, password, name) => {
    try {
      setIsLoading(true);
      
      // Call register API using authService
      const response = await authService.register(username, password, name);
      
      // If registration was successful, log user in
      if (response.data && response.data.success) {
        return login(username, password);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Registration failed" 
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshToken = async () => {
    try {
      if (!tokens || !tokens.refresh_token) {
        logout();
        return { success: false, error: "No refresh token available" };
      }
      
      // Call refresh token API using authService
      const response = await authService.refreshToken(tokens.refresh_token);
      
      if (response.data && response.data.access_token && response.data.refresh_token) {
        // Update tokens with the response data
        const newTokens = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          token_type: response.data.token_type || "bearer"
        };
        
        // Update stored tokens
        setTokens(newTokens);
        localStorage.setItem("tokens", JSON.stringify(newTokens));
        
        return { success: true, tokens: newTokens };
      }
      
      return { success: false, error: "Failed to refresh token" };
    } catch (error) {
      console.error("Token refresh error:", error);
      
      // If refresh fails with 401, log out the user
      if (error.response?.status === 401) {
        logout();
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Failed to refresh token" 
      };
    }
  };
  
  const logout = () => {
    // Call logout API if needed
    try {
      authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Clear local state and storage
    setTokens(null);
    localStorage.removeItem("tokens");
  };
  
  return (
    <AuthContext.Provider
      value={{
        tokens,
        login,
        register,
        logout,
        refreshToken,
        isLoading,
        isAuthenticated: !!tokens?.access_token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext); 