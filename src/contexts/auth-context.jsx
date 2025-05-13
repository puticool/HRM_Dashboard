import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/utils/api";
import api from "@/utils/api";
import PropTypes from "prop-types";

const AuthContext = createContext({
	login: () => { },
	register: () => { },
	logout: () => { },
	refreshToken: () => { },
	hasPermission: () => { },
	user: null,
	isLoading: false,
	isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
	const [tokens, setTokens] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);
	
	// Compute isAuthenticated based on user state
	const isAuthenticated = !!user;

	useEffect(() => {
		const accessToken = localStorage.getItem("access_token");
		const refreshToken = localStorage.getItem("refresh_token");

		if (accessToken && refreshToken) {
			setTokens({
				access_token: accessToken,
				refresh_token: refreshToken
			});

			// Get user data on initial load
			const getUser = async () => {
				try {
					const response = await getMe();
					if (response) {
						localStorage.setItem("user", JSON.stringify(response));
						setUser(response);
					} else {
						// If user data can't be retrieved, token might be expired
						const refreshResult = await refreshToken();
						if (!refreshResult.success) {
							// If refresh failed, clear everything
							logout();
						}
					}
				} catch (error) {
					console.error("Error getting user data:", error);
					logout();
				} finally {
					setIsLoading(false);
				}
			};
			getUser();
		} else {
			setIsLoading(false);
		}
	}, []);


	const getMe = async () => {
		try {
			const response = await api.get('/auth/me');
			if (response.data && response.data.status === 'success') {
				return response.data.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("GetMe error:", error);
			return null;
		}
	};

	const login = async (username, password) => {
		try {
			setIsLoading(true);

			// Call login API using authService
			const response = await authService.login(username, password);

			// Check if the response has token data
			if (response.data && response.data.access_token && response.data.refresh_token) {
				// Save token data
				const accessToken = response.data.access_token;
				const refreshToken = response.data.refresh_token;
				
				localStorage.setItem("access_token", accessToken);
				localStorage.setItem("refresh_token", refreshToken);
				
				setTokens({
					access_token: accessToken,
					refresh_token: refreshToken
				});

				// Get user data
				const userData = await getMe();
				if (userData) {
					localStorage.setItem("user", JSON.stringify(userData));
					setUser(userData);
					return { success: true };
				} else {
					return { 
						success: false, 
						error: "Failed to get user information" 
					};
				}
			} else {
				return { 
					success: false, 
					error: "Invalid response from server" 
				};
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
			const response = await authService.register(username, password, name);
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

	const refreshTokenFunc = async () => {
		try {
			if (!tokens || !tokens.refresh_token) {
				logout();
				return { success: false, error: "No refresh token available" };
			}
			
			const response = await authService.refreshToken(tokens.refresh_token);

			if (response.data && response.data.access_token && response.data.refresh_token) {
				const accessToken = response.data.access_token;
				const refreshToken = response.data.refresh_token;
				
				// Update tokens in state and localStorage
				const newTokens = {
					access_token: accessToken,
					refresh_token: refreshToken
				};
				
				setTokens(newTokens);
				localStorage.setItem("access_token", accessToken);
				localStorage.setItem("refresh_token", refreshToken);

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

	const hasPermission = (resource, action) => {
		if (!user) return false;
		return user.roles.some(role =>
			role.permissions.some(p => p.resource === resource && p.action === action)
		);
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
		setUser(null);
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider
			value={{
				login,
				register,
				logout,
				refreshToken: refreshTokenFunc,
				hasPermission,
				isLoading,
				isAuthenticated,
				user
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