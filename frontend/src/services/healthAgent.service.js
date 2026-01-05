import axios from 'axios';
import { getHealthProfile } from './profile.service';

// FastAPI base URL
const FASTAPI_BASE_URL = 'http://localhost:8000';

/**
 * Convert base64 string to File object
 * @param {string} base64String - Base64 encoded image string
 * @param {string} filename - Desired filename
 * @returns {File} File object
 */
const base64ToFile = (base64String, filename = 'food-label.jpg') => {
    // Remove data URL prefix if present (data:image/jpeg;base64,...)
    const base64Data = base64String.split(',')[1] || base64String;

    // Convert base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Create blob
    const blob = new Blob([bytes], { type: 'image/jpeg' });

    // Create file from blob
    const file = new File([blob], filename, { type: 'image/jpeg' });

    return file;
};

/**
 * Get user's health profile summary
 * @returns {Promise<string>} Health profile summary string
 */
const getUserHealthProfileSummary = async () => {
    try {
        const response = await getHealthProfile();
        const profile = response.data;

        // Build comprehensive health profile string
        const parts = [];

        if (profile.conditions && profile.conditions.length > 0) {
            parts.push(`Medical conditions: ${profile.conditions.join(', ')}`);
        }

        if (profile.allergies && profile.allergies.length > 0) {
            parts.push(`Allergies: ${profile.allergies.join(', ')}`);
        }

        if (profile.diets && profile.diets.length > 0) {
            parts.push(`Dietary preferences: ${profile.diets.join(', ')}`);
        }

        if (profile.goals && profile.goals.length > 0) {
            parts.push(`Health goals: ${profile.goals.join(', ')}`);
        }

        // Return profile summary or default
        return parts.length > 0
            ? parts.join('. ') + '.'
            : 'General health analysis with focus on common dietary concerns';

    } catch (error) {
        console.error('Error fetching health profile:', error);
        // Return default profile if fetch fails
        return 'General health analysis with focus on common dietary concerns';
    }
};

/**
 * Analyze food label image using FastAPI health agent
 * @param {string} base64Image - Base64 encoded image from localStorage
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeFoodLabel = async (base64Image, signal = null) => {
    try {
        // 1. Convert base64 to File
        const timestamp = Date.now();
        const filename = `food-label-${timestamp}.jpg`;
        const imageFile = base64ToFile(base64Image, filename);

        // 2. Get user health profile
        const userHealthProfile = await getUserHealthProfileSummary();

        // 3. Create FormData
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('user_health_profile', userHealthProfile);

        // 4. Send to FastAPI with optional abort signal
        const response = await axios.post(
            `${FASTAPI_BASE_URL}/api/v1/analyze`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Increase timeout as AI analysis can take time (especially with multiple AI calls)
                timeout: 360000, // 6 minutes (AI analysis can be slow)
                // Add abort signal if provided
                signal: signal,
            }
        );

        // 5. Return parsed response
        return response.data;

    } catch (error) {
        console.error('Error analyzing food label:', error);

        // Better error messages
        if (error.code === 'ECONNABORTED') {
            throw new Error('Analysis timed out. Please try again.');
        } else if (error.response) {
            throw new Error(error.response.data.detail || 'Analysis failed');
        } else if (error.request) {
            throw new Error('Unable to connect to analysis service. Please ensure the FastAPI server is running.');
        } else {
            throw new Error('An unexpected error occurred during analysis');
        }
    }
};

/**
 * Check if FastAPI health service is available
 * @returns {Promise<boolean>} True if service is healthy
 */
export const checkHealthServiceStatus = async () => {
    try {
        const response = await axios.get(`${FASTAPI_BASE_URL}/api/v1/health`, {
            timeout: 5000,
        });
        return response.data.status === 'healthy';
    } catch (error) {
        console.error('Health service check failed:', error);
        return false;
    }
};

export default {
    analyzeFoodLabel,
    checkHealthServiceStatus,
};
