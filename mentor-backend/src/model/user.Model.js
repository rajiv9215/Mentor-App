import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'mentor', 'admin'],
        default: 'user',
    },
    avatar: {
        type: String,
        default: '',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await comparePassword(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;