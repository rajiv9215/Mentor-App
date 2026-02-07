import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

const mentorSchema = new mongoose.Schema({
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
        default: 'mentor',
    },
    avatar: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    company: {
        type: String,
        default: '',
    },
    jobTitle: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    languages: {
        type: [String],
        default: ['English'],
    },
    hourlyRate: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalSessions: {
        type: Number,
        default: 0,
    },
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available',
    },
    slots: [{
        day: {
            type: String,
            required: false, // Changed to false to allow date-only slots if needed, or just optional
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        date: {
            type: Date,
            required: false // Optional, for specific date slots
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        isBooked: {
            type: Boolean,
            default: false
        },
        sessionTypes: [{
            type: String,
            enum: ['chat', 'call', 'video'],
            default: []
        }]
    }],
    isApproved: {
        type: Boolean,
        default: false,
    },
    linkedIn: {
        type: String,
        default: '',
    },
    twitter: {
        type: String,
        default: '',
    },
    website: {
        type: String,
        default: '',
    }
}, {
    timestamps: true,
});

// Hash password before saving
mentorSchema.pre('save', async function (next) {
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
mentorSchema.methods.comparePassword = async function (candidatePassword) {
    return await comparePassword(candidatePassword, this.password);
};

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;
