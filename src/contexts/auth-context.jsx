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
	tokens: null
});

export const AuthProvider = ({ children }) => {
	const [tokens, setTokens] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);
	useEffect(() => {
		const savedTokens = localStorage.getItem("access_token");

		if (savedTokens) {
			setTokens(savedTokens);

			// đoạn này nó chuyển sync thành async await nên đừng xóa kẻo ui nó load trước dữ liệu
			const getUser = async () => {
				const response = await getMe();
				localStorage.setItem("user", JSON.stringify(response));
				setUser(response);
			}
			getUser();
		}

		setIsLoading(false);
	}, []);


	const getMe = async () => {
		const response = await api.get('/auth/me');
		if (response.data && response.data.status === 'success') {
			return response.data.data;
		} else {
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
				localStorage.setItem("access_token", response.data.access_token);
				localStorage.setItem("refresh_token", response.data.refresh_token);

				const response2 = await getMe();
				localStorage.setItem("user", JSON.stringify(response2));
				setUser(response2);

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

	const refreshToken = async () => {
		try {
			if (!tokens || !tokens.refresh_token) {
				logout();
				return { success: false, error: "No refresh token available" };
			}
			const response = await authService.refreshToken(tokens.refresh_token);

			if (response.data && response.data.access_token && response.data.refresh_token) {
				const newTokens = {
					access_token: response.data.access_token,
					refresh_token: response.data.refresh_token,
					token_type: response.data.token_type || "bearer"
				};
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
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider
			value={{
				tokens,
				login,
				register,
				logout,
				refreshToken,
				hasPermission,
				isLoading,
				isAuthenticated: !!tokens,
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