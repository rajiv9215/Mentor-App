import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    updateUserRole
} from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const adminRouter = express.Router();

// All admin routes are protected
adminRouter.use(authenticate, isAdmin);

adminRouter.get('/stats', getDashboardStats);
adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:id/role', updateUserRole);

export default adminRouter;
