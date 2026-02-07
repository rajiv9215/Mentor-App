import express from 'express';
import {
    submitApplication,
    getAllApplications,
    updateApplicationStatus
} from '../controllers/mentorApplicationController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const applicationRouter = express.Router();

// Public route - anyone can apply
applicationRouter.post('/mentor', submitApplication);

// Protected routes (Admin only)
applicationRouter.get('/mentor', authenticate, isAdmin, getAllApplications);
applicationRouter.put('/mentor/:id', authenticate, isAdmin, updateApplicationStatus);

export default applicationRouter;
