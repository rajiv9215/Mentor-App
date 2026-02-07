import express from 'express';
import Message from '../model/message.Model.js';
import ChatRoom from '../model/chatRoom.Model.js';
import Booking from '../model/booking.Model.js';
import Mentor from '../model/mentor.Model.js';
import User from '../model/user.Model.js';
import { authenticate } from '../middleware/authMiddleware.js';

const chatRouter = express.Router();

/**
 * Create or get chat room for a booking
 */
chatRouter.post('/room/create', authenticate, async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user._id;

        // Verify booking exists and user is participant
        const booking = await Booking.findById(bookingId)
            .populate('mentorId')
            .populate('userId');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check payment status
        if (booking.paymentStatus !== 'paid') {
            return res.status(403).json({
                success: false,
                message: 'Payment required to access chat. Please complete payment first.'
            });
        }

        // Check if current time is within booking time slot
        const now = new Date();
        const bookingDate = new Date(booking.date);

        // Parse start and end times (format: "HH:MM")
        const [startHour, startMinute] = booking.startTime.split(':').map(Number);
        const [endHour, endMinute] = booking.endTime.split(':').map(Number);

        // Create datetime objects for start and end
        const startDateTime = new Date(bookingDate);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date(bookingDate);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        // Check if current time is within the slot
        if (now < startDateTime) {
            const dateStr = bookingDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            return res.status(403).json({
                success: false,
                message: `Chat will be available on ${dateStr} from ${booking.startTime} to ${booking.endTime}. Please wait until your session starts.`
            });
        }

        if (now > endDateTime) {
            const dateStr = bookingDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            return res.status(403).json({
                success: false,
                message: `This chat session ended on ${dateStr} at ${booking.endTime}. The session is no longer available.`
            });
        }

        // Check if user is either the mentee or mentor
        // Since fields are populated, we access _id
        const isMentee = booking.userId._id.toString() === userId.toString();

        // For mentor, check if user's email matches the mentor profile
        // booking.mentorId is the Mentor document
        const bookingMentorProfile = booking.mentorId;
        const isMentor = bookingMentorProfile && bookingMentorProfile.email === req.user.email;

        if (!isMentee && !isMentor) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to this booking'
            });
        }

        // Resolve Mentor's User ID correctly
        // booking.mentorId is POPULATED, so it is the Mentor Document.
        // We need to find the User document corresponding to this Mentor's email.

        let mentorUserId;

        if (bookingMentorProfile && bookingMentorProfile.email) {
            const mentorUser = await User.findOne({ email: bookingMentorProfile.email });
            if (mentorUser) {
                mentorUserId = mentorUser._id;
            }
        }

        // Fallback: This is critical. If we can't find the mentor's user ID, chat won't work correctly for them.
        if (!mentorUserId) {
            console.error(`Could not find User account for Mentor ID ${bookingMentorProfile?._id} (Email: ${bookingMentorProfile?.email})`);
            return res.status(500).json({
                success: false,
                message: 'System error: Mentor user account not found.'
            });
        }

        let room = await ChatRoom.findOne({ bookingId });

        if (!room) {
            // Create new room
            room = new ChatRoom({
                bookingId,
                participants: [booking.userId._id, mentorUserId], // booking.userId is also populated
                unreadCount: {
                    [booking.userId._id.toString()]: 0,
                    [mentorUserId.toString()]: 0
                }
            });
            await room.save();
        }

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create chat room'
        });
    }
});

/**
 * Get chat room by booking ID
 */
chatRouter.get('/room/:bookingId', authenticate, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        const room = await ChatRoom.findOne({ bookingId })
            .populate('participants', 'name email');

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Chat room not found'
            });
        }

        // Verify user is participant
        const isParticipant = room.participants.some(
            p => p._id.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error('Error fetching chat room:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat room'
        });
    }
});

/**
 * Get message history for a room
 */
chatRouter.get('/messages/:roomId', authenticate, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        // Verify user is participant
        const room = await ChatRoom.findById(roomId);
        if (!room || !room.participants.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const messages = await Message.find({ roomId })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('senderId', 'name')
            .populate('receiverId', 'name');

        res.json({
            success: true,
            data: messages.reverse()
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

/**
 * Get user's chat rooms
 */
chatRouter.get('/rooms', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;

        const rooms = await ChatRoom.find({
            participants: userId,
            isActive: true
        })
            .populate('bookingId')
            .populate('participants', 'name email')
            .sort({ lastMessageTime: -1 });

        res.json({
            success: true,
            data: rooms
        });
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat rooms'
        });
    }
});

export default chatRouter;
