import { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = authService.getAccessToken();

            if (token) {
                try {
                    const response = await authService.getProfile();
                    if (response.data?.user) {
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    // Clear invalid tokens
                    authService.logout();
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const register = async (name, email, password) => {
        try {
            const response = await authService.register({ name, email, password });

            if (response.data?.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true, user: response.data.user };
            }

            return { success: false, error: 'Registration failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            return { success: false, error: errorMessage, errors: error.response?.data?.errors };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });

            if (response.data?.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true, user: response.data.user };
            }

            return { success: false, error: 'Login failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await authService.updateProfile(data);

            if (response.data?.user) {
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }

            return { success: false, error: 'Profile update failed' };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
            return { success: false, error: errorMessage, errors: error.response?.data?.errors };
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
