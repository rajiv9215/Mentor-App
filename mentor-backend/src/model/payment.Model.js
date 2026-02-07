import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
        default: null
    },
    signature: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'pending', 'success', 'failed'],
        default: 'created'
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    sessionType: {
        type: String,
        enum: ['chat', 'call', 'video'],
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
