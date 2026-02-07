import express from 'express';
import { createBooking, getUserBookings, getBookingById, getMentorBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/mentor-bookings', getMentorBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);

export default router;
