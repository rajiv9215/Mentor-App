import api from './api';

/**
 * Create Razorpay order
 */
export const createOrder = async (orderData) => {
    const response = await api.post('/payments/create-order', orderData);
    return response.data;
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
};

/**
 * Get user payment history
 */
export const getUserPaymentHistory = async () => {
    const response = await api.get('/payments/user/history');
    return response.data;
};

const paymentService = {
    createOrder,
    verifyPayment,
    getPaymentDetails,
    getUserPaymentHistory
};

export default paymentService;
