import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaArrowLeft, FaCircle } from 'react-icons/fa';
import chatService from '../../services/chatService';
import chatApiService from '../../services/chatApiService';
import bookingService from '../../services/bookingService';
import authService from '../../services/authService';

const ChatSession = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState(null);
    const [booking, setBooking] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        initializeChat();
        return () => {
            chatService.removeAllListeners();
            chatService.disconnect();
        };
    }, [bookingId]);

    const initializeChat = async () => {
        try {
            setLoading(true);

            // Get booking details
            const bookingResponse = await bookingService.getBookingById(bookingId);
            if (!bookingResponse.success) {
                throw new Error('Booking not found');
            }
            setBooking(bookingResponse.data);

            // Determine other user
            let currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                try {
                    const userProfile = await authService.getCurrentUser();
                    if (userProfile.data?._id) {
                        currentUserId = userProfile.data._id;
                        localStorage.setItem('userId', currentUserId);
                    }
                } catch (err) {
                    console.error("Failed to fetch current user", err);
                }
            }

            const other = bookingResponse.data.userId._id === currentUserId
                ? bookingResponse.data.mentorId
                : bookingResponse.data.userId;
            setOtherUser(other);

            // Create or get chat room
            const roomResponse = await chatApiService.createChatRoom(bookingId);
            if (!roomResponse.success) {
                throw new Error('Failed to create chat room');
            }
            setRoom(roomResponse.data);

            // Connect to Socket.io
            const token = localStorage.getItem('token');
            chatService.connect(token);

            // Join room
            chatService.joinRoom(roomResponse.data._id);
            chatService.markAsRead(roomResponse.data._id);

            // Set up event listeners
            chatService.onRoomHistory((history) => {
                setMessages(history);
                setConnected(true);
                scrollToBottom();
            });

            chatService.onNewMessage((message) => {
                setMessages(prev => [...prev, message]);
                scrollToBottom();

                // Mark as read if message is from other user
                if (message.senderId._id !== currentUserId) {
                    chatService.markAsRead(roomResponse.data._id);
                }
            });

            chatService.onUserTyping(({ userId, isTyping }) => {
                if (userId !== currentUserId) {
                    setIsTyping(isTyping);
                }
            });

            setLoading(false);
        } catch (err) {
            console.error('Error initializing chat:', err);
            setError(err.message || 'Failed to load chat');
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !room || !otherUser) return;

        chatService.sendMessage(room._id, otherUser._id, newMessage.trim());
        setNewMessage('');

        // Stop typing indicator
        chatService.sendTyping(room._id, false);
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!room) return;

        // Send typing indicator
        chatService.sendTyping(room._id, true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            chatService.sendTyping(room._id, false);
        }, 2000);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                <p className="text-xl text-neutral-600 dark:text-neutral-400">Loading chat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    const currentUserId = localStorage.getItem('userId');

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/bookings')}
                            className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                        >
                            <FaArrowLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                                {otherUser?.name || 'Chat'}
                            </h1>
                            {booking && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                    {new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • {booking.startTime} - {booking.endTime}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                <FaCircle className={`text-xs ${connected ? 'text-green-500' : 'text-gray-400'}`} />
                                <span>{connected ? 'Connected' : 'Connecting...'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, index) => {
                        const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
                        const isOwnMessage = senderId?.toString() === currentUserId;
                        return (
                            <div
                                key={index}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${isOwnMessage
                                            ? 'bg-primary-600 text-white rounded-br-none'
                                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm break-words">{msg.message}</p>
                                    </div>
                                    <p className={`text-xs text-neutral-500 dark:text-neutral-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            <FaPaperPlane />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatSession;
