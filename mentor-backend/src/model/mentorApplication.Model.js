import mongoose from 'mongoose';

const mentorApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    expertise: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
        enum: ['3-5', '5-10', '10+'],
    },
    linkedin: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    },
    reviewNotes: {
        type: String,
        default: '',
    }
}, {
    timestamps: true,
});

const MentorApplication = mongoose.model('MentorApplication', mentorApplicationSchema);

export default MentorApplication;
