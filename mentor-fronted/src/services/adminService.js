import api from './api';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

/**
 * Get all users
 */
export const getAllUsers = async (page = 1, limit = 10, role = null) => {
    const params = { page, limit };
    if (role) params.role = role;

    const response = await api.get('/admin/users', { params });
    return response.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
};

/**
 * Get pending mentor applications
 */
export const getPendingApplications = async () => {
    const response = await api.get('/applications/mentor', { params: { status: 'pending' } });
    return response.data;
};

/**
 * Approve mentor application
 */
export const approveMentorApplication = async (applicationId) => {
    const response = await api.put(`/applications/mentor/${applicationId}`, { status: 'approved' });
    return response.data;
};

/**
 * Reject mentor application
 */
export const rejectMentorApplication = async (applicationId) => {
    const response = await api.put(`/applications/mentor/${applicationId}`, { status: 'rejected' });
    return response.data;
};

const adminService = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    getPendingApplications,
    approveMentorApplication,
    rejectMentorApplication
};

export default adminService;
