import api from './api';

/**
 * Create or get chat room for a booking
 */
export const createChatRoom = async (bookingId) => {
    const response = await api.post('/chat/room/create', { bookingId });
    return response.data;
};

/**
 * Get chat room by booking ID
 */
export const getChatRoom = async (bookingId) => {
    const response = await api.get(`/chat/room/${bookingId}`);
    return response.data;
};

/**
 * Get message history
 */
export const getMessages = async (roomId, limit = 50, skip = 0) => {
    const response = await api.get(`/chat/messages/${roomId}`, {
        params: { limit, skip }
    });
    return response.data;
};

/**
 * Get user's chat rooms
 */
export const getUserChatRooms = async () => {
    const response = await api.get('/chat/rooms');
    return response.data;
};

const chatApiService = {
    createChatRoom,
    getChatRoom,
    getMessages,
    getUserChatRooms
};

export default chatApiService;
