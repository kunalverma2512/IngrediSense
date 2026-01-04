import axios from 'axios';
import { API_BASE_URL } from './endpoints';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - Attach token to requests
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if it exists
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
    (response) => {
        // Return the data directly for successful responses
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token
                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken) {
                    // Try to refresh the access token
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh-token`,
                        { refreshToken }
                    );

                    if (response.data?.data?.accessToken) {
                        // Store new tokens
                        localStorage.setItem('accessToken', response.data.data.accessToken);
                        localStorage.setItem('refreshToken', response.data.data.refreshToken);

                        // Update the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

                        // Retry the original request
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Optionally redirect to login page or emit an event
                window.location.href = '/';

                return Promise.reject(refreshError);
            }
        }

        // Extract error message
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', errorMessage);

        return Promise.reject(error);
    }
);

export default apiClient;
