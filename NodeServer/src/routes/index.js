import express from 'express';
const router = express.Router();

// Import route modules
import ingredientRoutes from './ingredient.routes.js';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';

// API Info
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'IngrediSense API v1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            ingredients: '/api/ingredients',
            profile: '/api/profile',
        },
    });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/profile', profileRoutes);

export default router;
