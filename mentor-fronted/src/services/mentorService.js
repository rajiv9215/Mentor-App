import api from './api';

/**
 * Get all mentors with optional filters
 */
export const getAllMentors = async (filters = {}) => {
    const { search, category, availability, minRating } = filters;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (availability) params.append('availability', availability);
    if (minRating) params.append('minRating', minRating);

    const response = await api.get(`/mentors?${params.toString()}`);
    return response.data;
};

/**
 * Get single mentor by ID
 */
export const getMentorById = async (id) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
};

/**
 * Submit mentor application
 */
export const applyAsMentor = async (applicationData) => {
    const response = await api.post('/applications/mentor', applicationData);
    return response.data;
};

/**
 * Create new mentor (Admin only)
 */
export const createMentor = async (mentorData) => {
    const response = await api.post('/mentors', mentorData);
    return response.data;
};

/**
 * Update mentor (Admin only)
 */
export const updateMentor = async (id, mentorData) => {
    const response = await api.put(`/mentors/${id}`, mentorData);
    return response.data;
};

/**
 * Delete mentor (Admin only)
 */
export const deleteMentor = async (id) => {
    const response = await api.delete(`/mentors/${id}`);
    return response.data;
};

/**
 * Get current mentor's own profile
 */
export const getMyMentorProfile = async () => {
    const response = await api.get('/mentors/me/profile');
    return response.data;
};

const mentorService = {
    getAllMentors,
    getMentorById,
    applyAsMentor,
    createMentor,
    updateMentor,
    deleteMentor,
    getMyMentorProfile
};

export default mentorService;
