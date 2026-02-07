import Blog from '../model/blog.Model.js';

/**
 * Get all published blogs
 * @route GET /api/v1/blogs
 */
export const getAllBlogs = async (req, res) => {
    try {
        const { category, tag } = req.query;

        let query = { isPublished: true };

        if (category) {
            query.category = category;
        }

        if (tag) {
            query.tags = tag;
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name avatar')
            .sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching blogs'
        });
    }
};

/**
 * Get single blog by ID
 * @route GET /api/v1/blogs/:id
 */
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id).populate('author', 'name avatar bio');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching blog'
        });
    }
};

/**
 * Create new blog (Protected - Mentor/Admin only)
 * @route POST /api/v1/blogs
 */
export const createBlog = async (req, res) => {
    try {
        const blogData = {
            ...req.body,
            author: req.user._id
        };

        const blog = await Blog.create(blogData);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating blog'
        });
    }
};

/**
 * Update blog (Protected - Author/Admin only)
 * @route PUT /api/v1/blogs/:id
 */
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // Find blog
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this blog'
            });
        }

        // Update blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating blog'
        });
    }
};

/**
 * Delete blog (Admin only)
 * @route DELETE /api/v1/blogs/:id
 */
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting blog'
        });
    }
};
