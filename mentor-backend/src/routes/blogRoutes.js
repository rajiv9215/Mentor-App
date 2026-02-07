import express from 'express';
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import { authenticate, isMentor, isAdmin } from '../middleware/authMiddleware.js';

const blogRouter = express.Router();

// Public routes
blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getBlogById);

// Protected routes (Mentor/Admin can create and update)
blogRouter.post('/', authenticate, isMentor, createBlog);
blogRouter.put('/:id', authenticate, updateBlog);

// Admin only
blogRouter.delete('/:id', authenticate, isAdmin, deleteBlog);

export default blogRouter;
