import User from '../models/User.model.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.util.js';
import logger from '../utils/logger.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('Email already registered. Please use a different email or login.');
            error.statusCode = 409;
            throw error;
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Remove password from output
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
        };

        logger.info(`New user registered: ${email}`);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: userResponse,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password matches
        if (!user || !(await user.matchPassword(password))) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Remove password from output
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
        };

        logger.info(`User logged in: ${email}`);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: userResponse,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;

        // Build update object with only provided fields
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (avatar) updateFields.avatar = avatar;

        // Check if email is being changed and if it's already taken
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const error = new Error('Email already in use by another account');
                error.statusCode = 409;
                throw error;
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateFields,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        logger.info(`User profile updated: ${user.email}`);

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            const error = new Error('Current password is incorrect');
            error.statusCode = 401;
            throw error;
        }

        // Check if new password is same as old password
        const isSamePassword = await user.matchPassword(newPassword);
        if (isSamePassword) {
            const error = new Error('New password must be different from current password');
            error.statusCode = 400;
            throw error;
        }

        // Update password
        user.password = newPassword;
        await user.save();

        logger.info(`Password changed for user: ${user.email}`);

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully. Please log in again with your new password.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete account
 * @route   DELETE /api/auth/account
 * @access  Private
 */
export const deleteAccount = async (req, res, next) => {
    try {
        const { password } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            const error = new Error('Incorrect password. Account deletion failed.');
            error.statusCode = 401;
            throw error;
        }

        // Delete user
        await User.findByIdAndDelete(req.user.id);

        logger.info(`Account deleted: ${user.email}`);

        res.status(200).json({
            status: 'success',
            message: 'Account deleted successfully. We\'re sad to see you go!',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            const error = new Error('Refresh token is required');
            error.statusCode = 400;
            throw error;
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (err) {
            const error = new Error('Invalid or expired refresh token');
            error.statusCode = 401;
            throw error;
        }

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Generate new tokens
        const tokens = generateTokens(user._id);

        logger.info(`Access token refreshed for user: ${user.email}`);

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res, next) => {
    try {
        // Note: With JWT, logout is primarily handled client-side by removing tokens
        // This endpoint exists for consistency and can be used for logging/analytics

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully. Please remove tokens from client.',
        });
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshAccessToken,
    logout,
};
