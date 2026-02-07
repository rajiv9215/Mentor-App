import User from '../model/user.Model.js';
import Mentor from '../model/mentor.Model.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * Register a new user
 * @route POST /api/v1/user/register
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if ([name, email, password].some((field) => !field || field.trim() === '')) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate JWT token
        const token = generateToken({ userId: user._id, email: user.email, role: user.role });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error registering user'
        });
    }
};

/**
 * Login user
 * @route POST /api/v1/user/login
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password using the model method
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id, email: user.email, role: user.role });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging in'
        });
    }
};

/**
 * Logout user
 * @route POST /api/v1/user/logout
 */
export const logoutUser = async (req, res) => {
    try {
        // Clear token cookie
        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging out'
        });
    }
};

/**
 * Get current user profile
 * @route GET /api/v1/user/profile
 */
export const getUserProfile = async (req, res) => {
    try {
        // User is already attached to req by authenticate middleware
        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching profile'
        });
    }
};

/**
 * Update user profile
 * @route PUT /api/v1/user/profile
 */
export const updateUserProfile = async (req, res) => {
    try {
        const { name, avatar, email } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (avatar) updateData.avatar = avatar;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        // If email was updated and user is a mentor, update Mentor profile as well
        if (email && user.role === 'mentor') {
            await Mentor.findOneAndUpdate(
                { email: req.user.email }, // Find by OLD email (from token/req.user)
                { email: email }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating profile'
        });
    }
};
