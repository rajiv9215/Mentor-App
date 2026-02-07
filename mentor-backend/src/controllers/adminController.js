import User from '../model/user.Model.js';
import Mentor from '../model/mentor.Model.js';
import MentorApplication from '../model/mentorApplication.Model.js';
import Blog from '../model/blog.Model.js';

/**
 * Get dashboard statistics (Admin only)
 * @route GET /api/v1/admin/stats
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get counts
        const totalUsers = await User.countDocuments();
        const totalMentors = await Mentor.countDocuments({ isApproved: true });
        const pendingApplications = await MentorApplication.countDocuments({ status: 'pending' });
        const totalBlogs = await Blog.countDocuments({ isPublished: true });

        // Growth stats (last 30 days)
        const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newApplications = await MentorApplication.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // Get top mentors (by total sessions)
        const topMentors = await Mentor.find({ isApproved: true })
            .sort({ totalSessions: -1 })
            .limit(5)
            .select('name totalSessions company jobTitle avatar');

        // Get recent users
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent applications
        const recentApplications = await MentorApplication.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalMentors,
                    pendingApplications,
                    totalBlogs,
                    newUsers,
                    newApplications
                },
                topMentors,
                recentUsers,
                recentApplications
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching dashboard stats'
        });
    }
};

/**
 * Get all users with pagination (Admin only)
 * @route GET /api/v1/admin/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role } = req.query;

        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching users'
        });
    }
};

/**
 * Update user role (Admin only)
 * @route PUT /api/v1/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'mentor', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "user", "mentor", or "admin"'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating user role'
        });
    }
};
