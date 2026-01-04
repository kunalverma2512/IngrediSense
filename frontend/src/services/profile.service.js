import apiClient from './api/client';

const API_URL = '/profile';

/**
 * Get user's health profile
 * @returns {Promise} Health profile data
 */
export const getHealthProfile = async () => {
    return await apiClient.get(API_URL);
};

/**
 * Update or create health profile
 * @param {Object} data - {allergies, conditions, diets, goals, stats}
 * @returns {Promise} Updated health profile
 */
export const updateHealthProfile = async (data) => {
    return await apiClient.put(API_URL, data);
};

export default {
    getHealthProfile,
    updateHealthProfile,
};
