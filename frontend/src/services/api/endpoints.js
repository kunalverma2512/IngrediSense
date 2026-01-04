export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const ENDPOINTS = {
    // Auth endpoints
    USER_LOGIN: '/auth/login',
    USER_REGISTER: '/auth/register',

    // Ingredient analysis endpoints
    ANALYZE_INGREDIENT: '/ingredients/analyze',
    SCAN_PRODUCT: '/ingredients/scan',

    // User history
    GET_HISTORY: '/user/history',

    // Add more endpoints as needed
}
