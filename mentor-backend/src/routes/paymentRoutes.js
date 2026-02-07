import express from 'express';
import {
    createOrder,
    verifyPayment,
    getPaymentDetails,
    getUserPayments
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// All payment routes require authentication
paymentRouter.post('/create-order', authenticate, createOrder);
paymentRouter.post('/verify', authenticate, verifyPayment);
paymentRouter.get('/user/history', authenticate, getUserPayments);
paymentRouter.get('/:id', authenticate, getPaymentDetails);

export default paymentRouter;
