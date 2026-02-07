import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../model/message.Model.js';
import ChatRoom from '../model/chatRoom.Model.js';
import Mentor from '../model/mentor.Model.js';
import User from '../model/user.Model.js';
import Booking from '../model/booking.Model.js';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:1234',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId; // Use 'userId' field from JWT payload
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.userId}`);

        // Join room
        socket.on('join_room', async ({ roomId }) => {
            try {
                // Verify user is participant in this room (don't populate to keep as ObjectIds)
                const room = await ChatRoom.findById(roomId);
                if (!room) {
                    socket.emit('error', { message: 'Room not found' });
                    return;
                }

                // Get user details
                const user = await User.findById(socket.userId);
                if (!user) {
                    socket.emit('error', { message: 'User not found' });
                    return;
                }

                // Get booking details to check payment and time slot
                const booking = await Booking.findById(room.bookingId);
                if (!booking) {
                    socket.emit('error', { message: 'Booking not found' });
                    return;
                }

                // Check payment status
                if (booking.paymentStatus !== 'paid') {
                    socket.emit('error', { message: 'Payment required to access chat. Please complete payment first.' });
                    return;
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
                    socket.emit('error', {
                        message: `Chat will be available on ${dateStr} from ${booking.startTime} to ${booking.endTime}. Please wait until your session starts.`
                    });
                    return;
                }

                if (now > endDateTime) {
                    const dateStr = bookingDate.toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    });
                    socket.emit('error', {
                        message: `This chat session ended on ${dateStr} at ${booking.endTime}. The session is no longer available.`
                    });
                    return;
                }

                // Check if user is a participant
                // For mentees: direct user ID match
                // For mentors: check if user's email matches any mentor profile in participants
                const isDirectParticipant = room.participants.some(
                    participantId => participantId.toString() === socket.userId
                );

                // Check if user is a mentor by matching email
                let isMentorParticipant = false;
                for (const participantId of room.participants) {
                    const mentor = await Mentor.findById(participantId);
                    if (mentor && mentor.email === user.email) {
                        isMentorParticipant = true;
                        break;
                    }
                }

                if (!isDirectParticipant && !isMentorParticipant) {
                    socket.emit('error', { message: 'Unauthorized access to room' });
                    return;
                }

                socket.join(roomId);
                console.log(`User ${socket.userId} joined room ${roomId}`);

                // Send room history
                const messages = await Message.find({ roomId })
                    .sort({ timestamp: 1 })
                    .limit(50)
                    .populate('senderId', 'name')
                    .populate('receiverId', 'name');

                socket.emit('room_history', messages);

                // Confirm room joined
                socket.emit('room_joined', { roomId, success: true });
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Send message
        socket.on('send_message', async ({ roomId, receiverId, message }) => {
            try {
                // Create and save message
                const newMessage = new Message({
                    roomId,
                    senderId: socket.userId,
                    receiverId,
                    message,
                    timestamp: new Date()
                });

                await newMessage.save();
                await newMessage.populate('senderId', 'name');

                // Update chat room
                await ChatRoom.findByIdAndUpdate(roomId, {
                    lastMessage: message,
                    lastMessageTime: new Date(),
                    $inc: { [`unreadCount.${receiverId}`]: 1 }
                });

                // Emit to room
                io.to(roomId).emit('new_message', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', ({ roomId, isTyping }) => {
            socket.to(roomId).emit('user_typing', {
                userId: socket.userId,
                isTyping
            });
        });

        // Mark messages as read
        socket.on('mark_read', async ({ roomId }) => {
            try {
                await Message.updateMany(
                    { roomId, receiverId: socket.userId, isRead: false },
                    { isRead: true }
                );

                await ChatRoom.findByIdAndUpdate(roomId, {
                    [`unreadCount.${socket.userId}`]: 0
                });

                socket.to(roomId).emit('messages_read', { userId: socket.userId });
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // WebRTC Signaling Events
        socket.on('webrtc_offer', ({ roomId, offer }) => {
            console.log(`📹 WebRTC offer from ${socket.userId} in room ${roomId}`);
            // Relay offer to other participants in the room
            socket.to(roomId).emit('webrtc_offer', { offer, senderId: socket.userId });
        });

        socket.on('webrtc_answer', ({ roomId, answer }) => {
            console.log(`📹 WebRTC answer from ${socket.userId} in room ${roomId}`);
            // Relay answer to other participants in the room
            socket.to(roomId).emit('webrtc_answer', { answer, senderId: socket.userId });
        });

        socket.on('webrtc_ice_candidate', ({ roomId, candidate }) => {
            console.log(`📹 ICE candidate from ${socket.userId} in room ${roomId}`);
            // Relay ICE candidate to other participants in the room
            socket.to(roomId).emit('webrtc_ice_candidate', { candidate, senderId: socket.userId });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.userId}`);
        });
    });

    console.log('✅ Socket.io initialized');
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
