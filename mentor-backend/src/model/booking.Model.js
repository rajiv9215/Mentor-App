import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    sessionType: {
        type: String,
        enum: ['chat', 'call', 'video'],
        default: 'video'
    },
    price: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    meetingLink: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
