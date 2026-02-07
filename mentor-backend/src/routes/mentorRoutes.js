import express from 'express';
import {
    getAllMentors,
    getMentorById,
    createMentor,
    updateMentor,
    deleteMentor,
    updateAvailability,
    getMyMentorProfile
} from '../controllers/mentorController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const mentorRouter = express.Router();

// Public routes
mentorRouter.get('/', getAllMentors);
mentorRouter.get('/:id', getMentorById);

// Protected routes (Admin only)
// Protected routes (Admin only for CRUD, Mentor/Admin for availability)
mentorRouter.get('/me/profile', authenticate, getMyMentorProfile); // Get own mentor profile
mentorRouter.post('/', authenticate, isAdmin, createMentor);
mentorRouter.put('/availability', authenticate, updateAvailability); // Mentor updates their own availability
mentorRouter.put('/:id', authenticate, isAdmin, updateMentor);
mentorRouter.delete('/:id', authenticate, isAdmin, deleteMentor);

export default mentorRouter;
