import apiClient from './api/client';

const API_URL = '/auth';

/**
 * Register new user
 * @param {Object} data - {name, email, password}
 * @returns {Promise} User data and tokens
 */
export const register = async (data) => {
    const response = await apiClient.post(`${API_URL}/register`, data);
    if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
};

/**
 * Login user
 * @param {Object} data - {email, password}
 * @returns {Promise} User data and tokens
 */
export const login = async (data) => {
    const response = await apiClient.post(`${API_URL}/login`, data);
    if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
};

/**
 * Get current user profile
 * @returns {Promise} User data
 */
export const getProfile = async () => {
    return await apiClient.get(`${API_URL}/me`);
};

/**
 * Update user profile
 * @param {Object} data - {name, email, avatar}
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (data) => {
    return await apiClient.put(`${API_URL}/profile`, data);
};

/**
 * Change password
 * @param {Object} data - {currentPassword, newPassword, confirmPassword}
 * @returns {Promise} Success message
 */
export const changePassword = async (data) => {
    return await apiClient.put(`${API_URL}/change-password`, data);
};

/**
 * Delete account
 * @param {Object} data - {password}
 * @returns {Promise} Success message
 */
export const deleteAccount = async (data) => {
    return await apiClient.delete(`${API_URL}/account`, { data });
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} New tokens
 */
export const refreshAccessToken = async (refreshToken) => {
    const response = await apiClient.post(`${API_URL}/refresh-token`, { refreshToken });
    if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
};

/**
 * Logout user
 */
export const logout = async () => {
    try {
        await apiClient.post(`${API_URL}/logout`);
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

/**
 * Get access token from localStorage
 * @returns {string|null} Access token
 */
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token
 */
export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export default {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshAccessToken,
    logout,
    getAccessToken,
    getRefreshToken,
};
