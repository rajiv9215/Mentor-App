import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes
userRouter.post('/logout', authenticate, logoutUser);
userRouter.get('/profile', authenticate, getUserProfile);
userRouter.put('/profile', authenticate, updateUserProfile);

export default userRouter;
