import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        default: '',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    coverImage: {
        type: String,
        default: '',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishedAt: {
        type: Date,
    },
    views: {
        type: Number,
        default: 0,
    },
    readTime: {
        type: Number,
        default: 5,
    }
}, {
    timestamps: true,
});

// Auto-set publishedAt when isPublished changes to true
blogSchema.pre('save', function (next) {
    if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
