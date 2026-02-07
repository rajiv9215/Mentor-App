import Booking from '../model/booking.Model.js';
import Mentor from '../model/mentor.Model.js';

/**
 * Create a new booking
 * @route POST /api/v1/bookings
 */
export const createBooking = async (req, res) => {
    try {
        const { mentorId, date, startTime, endTime, sessionType, price, notes } = req.body;
        const userId = req.user._id;

        // Check if mentor exists
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found'
            });
        }

        // Check if slot is already booked (Range-based overlap detection)
        // A overlaps B if (StartA < EndB) and (EndA > StartB)
        const overlappingBooking = await Booking.findOne({
            mentorId,
            date: new Date(date),
            status: { $ne: 'cancelled' },
            $or: [
                {
                    // New start is between existing start and end
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (overlappingBooking) {
            return res.status(409).json({
                success: false,
                message: 'This time slot overlaps with an existing booking'
            });
        }

        const booking = await Booking.create({
            mentorId,
            userId,
            date: new Date(date),
            startTime,
            endTime,
            sessionType,
            price,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating booking'
        });
    }
};

/**
 * Get bookings for current user
 * @route GET /api/v1/bookings/my-bookings
 */
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ userId })
            .populate('mentorId', 'name avatar jobTitle company')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching bookings'
        });
    }
};

/**
 * Get booking by ID
 * @route GET /api/v1/bookings/:id
 */
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const booking = await Booking.findById(id)
            .populate('mentorId', 'name email avatar jobTitle company expertise')
            .populate('userId', 'name email avatar');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Verify user is either the mentee or mentor
        const isMentee = booking.userId._id.toString() === userId.toString();
        const mentor = await Mentor.findOne({ email: req.user.email });
        const isMentor = mentor && booking.mentorId._id.toString() === mentor._id.toString();

        if (!isMentee && !isMentor) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching booking'
        });
    }
};

/**
 * Get bookings for mentor
 * @route GET /api/v1/bookings/mentor-bookings
 */
export const getMentorBookings = async (req, res) => {
    try {
        // First find the mentor profile associated with this user
        const mentor = await Mentor.findOne({ email: req.user.email });

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor profile not found'
            });
        }

        const bookings = await Booking.find({ mentorId: mentor._id })
            .populate('userId', 'name email avatar')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get mentor bookings error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching bookings'
        });
    }
};

/**
 * Update booking status
 * @route PUT /api/v1/bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated',
            data: booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating booking'
        });
    }
};
