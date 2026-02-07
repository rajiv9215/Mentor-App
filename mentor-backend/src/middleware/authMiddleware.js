import { verifyToken } from '../utils/jwtUtils.js';
import User from '../model/user.Model.js';

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

/**
 * Middleware to check if user has mentor role
 */
export const isMentor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Mentor privileges required.'
        });
    }

    next();
};
