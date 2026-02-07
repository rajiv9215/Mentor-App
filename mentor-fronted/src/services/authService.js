import api from './api';

/**
 * Register a new user
 */
export const register = async (name, email, password) => {
    const response = await api.post('/user/register', { name, email, password });

    // Store token and userId in localStorage
    if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    if (response.data.data?.user?._id) {
        localStorage.setItem('userId', response.data.data.user._id);
    }

    return response.data;
};

/**
 * Login user
 */
export const login = async (email, password) => {
    const response = await api.post('/user/login', { email, password });

    // Store token and userId in localStorage
    if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    if (response.data.data?.user?._id) {
        localStorage.setItem('userId', response.data.data.user._id);
    }

    return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
    const response = await api.post('/user/logout');

    // Clear token and userId from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

/**
 * Get token from localStorage
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
    updateProfile
};

export default authService;
