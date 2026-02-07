import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../model/payment.Model.js';
import Booking from '../model/booking.Model.js';

// Initialize Razorpay instance only if keys are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_ID.includes('your_razorpay_key_id_here') &&
    !process.env.RAZORPAY_KEY_SECRET.includes('your_razorpay_key_secret_here')) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
} else {
    console.warn('⚠️  Razorpay keys not configured. Payment features will be disabled.');
}

/**
 * Create Razorpay order
 * @route POST /api/v1/payments/create-order
 */
export const createOrder = async (req, res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpay) {
            return res.status(503).json({
                success: false,
                message: 'Payment service not configured. Please add Razorpay API keys to .env file.'
            });
        }

        const { amount, currency, mentorId, sessionType, bookingData } = req.body;
        const userId = req.user._id;

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                mentorId,
                sessionType
            }
        };

        const order = await razorpay.orders.create(options);

        // Save payment record in database
        const payment = await Payment.create({
            orderId: order.id,
            amount: amount,
            currency: currency || 'INR',
            status: 'created',
            userId,
            mentorId,
            sessionType,
            metadata: bookingData
        });

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                paymentId: payment._id
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating order'
        });
    }
};

/**
 * Verify Razorpay payment signature
 * @route POST /api/v1/payments/verify
 */
export const verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentId, signature, paymentRecordId } = req.body;

        // Verify signature
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        console.log('🔐 Verifying Signature:');
        console.log('   Expected:', expectedSignature);
        console.log('   Received:', signature);
        console.log('   Body:', body);

        const isValid = expectedSignature === signature;

        if (!isValid) {
            console.error('❌ Signature mismatch!');
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Update payment record
        const payment = await Payment.findById(paymentRecordId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'success';
        await payment.save();

        // Check if slot is still available (Race condition check)
        // A overlaps B if (StartA < EndB) and (EndA > StartB)
        const bookingData = payment.metadata;

        const overlappingBooking = await Booking.findOne({
            mentorId: payment.mentorId,
            date: new Date(bookingData.date),
            status: { $ne: 'cancelled' },
            $or: [
                {
                    startTime: { $lt: bookingData.endTime },
                    endTime: { $gt: bookingData.startTime }
                }
            ]
        });

        if (overlappingBooking) {
            // Slot was taken while user was paying
            payment.status = 'failed';
            payment.paymentId = paymentId;
            payment.signature = signature;
            // Store specific failure reason in metadata or notes
            payment.metadata = { ...payment.metadata, failureReason: 'Slot taken during payment' };
            await payment.save();

            return res.status(409).json({
                success: false,
                message: 'Slot was booked by another user during payment. A refund will be initiated.'
            });
        }

        // Create booking after successful payment and availability check
        const booking = await Booking.create({
            mentorId: payment.mentorId,
            userId: payment.userId,
            date: new Date(bookingData.date),
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            sessionType: payment.sessionType,
            price: payment.amount,
            status: 'confirmed',
            paymentStatus: 'paid',
            notes: bookingData.notes || ''
        });

        // Link booking to payment
        payment.bookingId = booking._id;
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                payment,
                booking
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error verifying payment'
        });
    }
};

/**
 * Get payment details
 * @route GET /api/v1/payments/:id
 */
export const getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findById(id)
            .populate('userId', 'name email')
            .populate('mentorId', 'name email')
            .populate('bookingId');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching payment details'
        });
    }
};

/**
 * Get user's payment history
 * @route GET /api/v1/payments/user/history
 */
export const getUserPayments = async (req, res) => {
    try {
        const userId = req.user._id;

        const payments = await Payment.find({ userId })
            .populate('mentorId', 'name email avatar')
            .populate('bookingId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Get user payments error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching payment history'
        });
    }
};
