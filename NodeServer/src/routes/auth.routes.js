import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
    registerValidator,
    loginValidator,
    updateProfileValidator,
    changePasswordValidator,
    deleteAccountValidator,
} from '../middleware/validators/auth.validator.js';

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authController.logout);

// Protected routes (require authentication)
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, updateProfileValidator, authController.updateProfile);
router.put('/change-password', protect, changePasswordValidator, authController.changePassword);
router.delete('/account', protect, deleteAccountValidator, authController.deleteAccount);

export default router;
