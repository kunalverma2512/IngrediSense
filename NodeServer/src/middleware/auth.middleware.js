import User from '../models/User.model.js';
import { verifyAccessToken } from '../utils/jwt.util.js';
import logger from '../utils/logger.js';

/**
 * Protect routes - Verify JWT token and attach user to request
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            const error = new Error('Not authorized. Please log in to access this resource.');
            error.statusCode = 401;
            throw error;
        }

        try {
            // Verify token
            const decoded = verifyAccessToken(token);

            // Find user by ID from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                const error = new Error('User no longer exists. Please log in again.');
                error.statusCode = 401;
                throw error;
            }

            // Check if user changed password after token was issued
            if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
                const error = new Error('Password was recently changed. Please log in again.');
                error.statusCode = 401;
                throw error;
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (err) {
            logger.error(`Token verification failed: ${err.message}`);
            const error = new Error('Invalid or expired token. Please log in again.');
            error.statusCode = 401;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error('You do not have permission to perform this action.');
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};

/**
 * Optional auth - Attach user if token exists, but don't require it
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = verifyAccessToken(token);
                const user = await User.findById(decoded.id).select('-password');
                if (user) {
                    req.user = user;
                }
            } catch (err) {
                // Silently fail for optional auth
                logger.debug(`Optional auth failed: ${err.message}`);
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default {
    protect,
    authorize,
    optionalAuth,
};
