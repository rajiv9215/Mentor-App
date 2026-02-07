import api from './api';

/**
 * Create a booking
 */
export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

/**
 * Get current user's bookings
 */
export const getUserBookings = async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
};

/**
 * Get mentor's bookings
 */
export const getMentorBookings = async () => {
    const response = await api.get('/bookings/mentor-bookings');
    return response.data;
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
};

/**
 * Get mentor availability (slots)
 * Note: This might be part of getMentorById, but good to have specific call if needed
 */
export const getMentorAvailability = async (mentorId) => {
    // For now, we get this from mentor details
    // ensuring we have a dedicated service method if backend changes
    return null;
};

/**
 * Update mentor availability
 */
export const updateAvailability = async (slots) => {
    const response = await api.put('/mentors/availability', { slots });
    return response.data;
};

const bookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    getMentorBookings,
    updateBookingStatus,
    getMentorAvailability,
    updateAvailability
};

export default bookingService;
