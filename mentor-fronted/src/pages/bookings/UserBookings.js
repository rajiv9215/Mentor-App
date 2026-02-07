import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaVideo, FaPhone, FaComments, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaBan } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import chatApiService from '../../services/chatApiService';
import authService from '../../services/authService';

const UserBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [chatRooms, setChatRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) setCurrentUserId(userId);

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch bookings and chat rooms in parallel
            const [bookingRes, roomRes] = await Promise.all([
                bookingService.getUserBookings(),
                chatApiService.getUserChatRooms().catch(err => ({ success: false, data: [] }))
            ]);

            if (bookingRes.success) {
                setBookings(bookingRes.data);
            }

            if (roomRes.success) {
                // Create a map of bookingId -> unreadCount for current user
                const roomsMap = {};
                const userId = localStorage.getItem('userId');

                if (userId) {
                    roomRes.data.forEach(room => {
                        if (room.bookingId) {
                            const count = room.unreadCount && room.unreadCount[userId] ? room.unreadCount[userId] : 0;
                            const bookingId = typeof room.bookingId === 'object' ? room.bookingId._id : room.bookingId;

                            roomsMap[bookingId] = {
                                unreadCount: count,
                                lastMessageTime: room.lastMessageTime ? new Date(room.lastMessageTime) : null
                            };
                        }
                    });
                }
                setChatRooms(roomsMap);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const response = await bookingService.updateBookingStatus(bookingId, 'cancelled');
            if (response.success) {
                // Refresh list
                fetchData();
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError('Failed to cancel booking');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <FaCheckCircle className="text-green-500" />;
            case 'completed':
                return <FaCheckCircle className="text-blue-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            case 'pending':
                return <FaHourglassHalf className="text-yellow-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getSessionIcon = (type) => {
        switch (type) {
            case 'video':
                return <FaVideo className="text-purple-600" />;
            case 'call':
                return <FaPhone className="text-green-600" />;
            case 'chat':
                return <FaComments className="text-blue-600" />;
            default:
                return <FaUser />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);

        // Parse end time to get exact expiration
        const [endHour, endMinute] = booking.endTime.split(':').map(Number);
        const bookingEnd = new Date(bookingDate);
        bookingEnd.setHours(endHour, endMinute, 0, 0);

        const now = new Date();

        if (filter === 'all') return true;

        if (filter === 'cancelled') return booking.status === 'cancelled';

        if (filter === 'upcoming') {
            // Confirmed AND in the future. Excluding pending as they are not actionable.
            return booking.status === 'confirmed' && bookingEnd > now;
        }

        if (filter === 'past') {
            // Completed OR (Confirmed but time has passed)
            return booking.status === 'completed' ||
                (booking.status === 'confirmed' && bookingEnd <= now);
        }

        return true;
    }).sort((a, b) => {
        // Sort by lastMessageTime first if available (active chats top)
        const roomA = chatRooms[a._id];
        const roomB = chatRooms[b._id];

        const timeA = roomA?.lastMessageTime ? roomA.lastMessageTime.getTime() : 0;
        const timeB = roomB?.lastMessageTime ? roomB.lastMessageTime.getTime() : 0;

        if (timeA !== timeB) {
            return timeB - timeA; // Descending (newest message first)
        }

        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // For past/cancelled, show newest first (descending)
        if (filter === 'past' || filter === 'cancelled') {
            return dateB - dateA;
        }

        // For upcoming/all, show nearest/chronological first (ascending)
        return dateA - dateB;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                <p className="text-xl text-neutral-600 dark:text-neutral-400">Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">My Bookings</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">View and manage your mentorship sessions</p>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {['all', 'upcoming', 'past', 'cancelled'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap capitalize ${filter === filterOption
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
                                }`}
                        >
                            {filterOption}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
                        <FaCalendarAlt className="text-6xl text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No bookings found</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            {filter === 'all'
                                ? "You haven't booked any sessions yet"
                                : `No ${filter} bookings`}
                        </p>
                        <button
                            onClick={() => navigate('/find-mentor')}
                            className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            Find a Mentor
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Mentor Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold flex-shrink-0">
                                            {booking.mentorId?.name?.charAt(0).toUpperCase() || 'M'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                                                {booking.mentorId?.name || 'Mentor'}
                                            </h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                                                {booking.mentorId?.expertise || 'Mentorship Session'}
                                            </p>

                                            {/* Session Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 col-span-1 md:col-span-2">
                                                    <FaClock className="text-primary-600" />
                                                    <span>{formatDate(booking.date)} • {booking.startTime} - {booking.endTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                    {getSessionIcon(booking.sessionType)}
                                                    <span className="capitalize">{booking.sessionType} Session</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                    <span className="font-semibold text-primary-600">₹{booking.price}</span>
                                                    <span className="text-xs">• {booking.paymentStatus}</span>
                                                </div>
                                            </div>

                                            {booking.notes && (
                                                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 italic">
                                                    Note: {booking.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex flex-col items-end gap-3">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            <span className="capitalize">{booking.status}</span>
                                        </div>

                                        {booking.status === 'confirmed' && (
                                            <div className="flex flex-col gap-2">
                                                {/* Chat Session Button */}
                                                {booking.sessionType === 'chat' && (
                                                    (() => {
                                                        const isPaid = booking.paymentStatus === 'paid';

                                                        const now = new Date();
                                                        const bookingDate = new Date(booking.date);
                                                        const [startHour, startMinute] = booking.startTime.split(':').map(Number);
                                                        const [endHour, endMinute] = booking.endTime.split(':').map(Number);

                                                        const startDateTime = new Date(bookingDate);
                                                        startDateTime.setHours(startHour, startMinute, 0, 0);

                                                        const endDateTime = new Date(bookingDate);
                                                        endDateTime.setHours(endHour, endMinute, 0, 0);

                                                        const isTime = now >= startDateTime && now <= endDateTime;
                                                        const isTimeFuture = now < startDateTime;
                                                        const isTimePast = now > endDateTime;

                                                        const isDisabled = !isPaid || !isTime;

                                                        let title = "Start Chat";
                                                        if (!isPaid) title = "Payment required";
                                                        else if (isTimeFuture) {
                                                            title = `Available on ${bookingDate.toLocaleDateString()} at ${booking.startTime}`;
                                                        } else if (isTimePast) {
                                                            title = "Session ended";
                                                        }

                                                        return (
                                                            <button
                                                                onClick={() => !isDisabled && navigate(`/session/chat/${booking._id}`)}
                                                                disabled={isDisabled}
                                                                title={title}
                                                                className={`relative text-sm px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center ${isDisabled
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500'
                                                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                                                    }`}
                                                            >
                                                                <FaComments />
                                                                Start Chat
                                                                {chatRooms[booking._id]?.unreadCount > 0 && (
                                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-neutral-900">
                                                                        {chatRooms[booking._id].unreadCount > 9 ? '9+' : chatRooms[booking._id].unreadCount}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })()
                                                )}

                                                {/* Video Session Button */}
                                                {booking.sessionType === 'video' && (
                                                    (() => {
                                                        const isPaid = booking.paymentStatus === 'paid';

                                                        const now = new Date();
                                                        const bookingDate = new Date(booking.date);
                                                        const [startHour, startMinute] = booking.startTime.split(':').map(Number);
                                                        const [endHour, endMinute] = booking.endTime.split(':').map(Number);

                                                        const startDateTime = new Date(bookingDate);
                                                        startDateTime.setHours(startHour, startMinute, 0, 0);

                                                        const endDateTime = new Date(bookingDate);
                                                        endDateTime.setHours(endHour, endMinute, 0, 0);

                                                        const isTime = now >= startDateTime && now <= endDateTime;
                                                        const isTimeFuture = now < startDateTime;
                                                        const isTimePast = now > endDateTime;

                                                        const isDisabled = !isPaid || !isTime;

                                                        let title = "Start Video";
                                                        if (!isPaid) title = "Payment required";
                                                        else if (isTimeFuture) {
                                                            title = `Available on ${bookingDate.toLocaleDateString()} at ${booking.startTime}`;
                                                        } else if (isTimePast) {
                                                            title = "Session ended";
                                                        }

                                                        return (
                                                            <button
                                                                onClick={() => !isDisabled && navigate(`/session/video/${booking._id}`)}
                                                                disabled={isDisabled}
                                                                title={title}
                                                                className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center ${isDisabled
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500'
                                                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                                                    }`}
                                                            >
                                                                <FaVideo />
                                                                Start Video
                                                            </button>
                                                        );
                                                    })()
                                                )}

                                                {/* Call Session Button */}
                                                {booking.sessionType === 'call' && (
                                                    (() => {
                                                        const isPaid = booking.paymentStatus === 'paid';

                                                        const now = new Date();
                                                        const bookingDate = new Date(booking.date);
                                                        const [startHour, startMinute] = booking.startTime.split(':').map(Number);
                                                        const [endHour, endMinute] = booking.endTime.split(':').map(Number);

                                                        const startDateTime = new Date(bookingDate);
                                                        startDateTime.setHours(startHour, startMinute, 0, 0);

                                                        const endDateTime = new Date(bookingDate);
                                                        endDateTime.setHours(endHour, endMinute, 0, 0);

                                                        const isTime = now >= startDateTime && now <= endDateTime;
                                                        const isTimeFuture = now < startDateTime;
                                                        const isTimePast = now > endDateTime;

                                                        const isDisabled = !isPaid || !isTime;

                                                        let title = "Start Call";
                                                        if (!isPaid) title = "Payment required";
                                                        else if (isTimeFuture) {
                                                            title = `Available on ${bookingDate.toLocaleDateString()} at ${booking.startTime}`;
                                                        } else if (isTimePast) {
                                                            title = "Session ended";
                                                        }

                                                        return (
                                                            <button
                                                                onClick={() => !isDisabled && navigate(`/session/call/${booking._id}`)}
                                                                disabled={isDisabled}
                                                                title={title}
                                                                className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center ${isDisabled
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500'
                                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                                    }`}
                                                            >
                                                                <FaPhone />
                                                                Start Call
                                                            </button>
                                                        );
                                                    })()
                                                )}
                                                <button
                                                    onClick={() => navigate(`/mentor/${booking.mentorId?._id}`)}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                                >
                                                    View Mentor →
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === 'pending' && (
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                >
                                                    <FaBan />
                                                    Cancel Request
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/mentor/${booking.mentorId?._id}`)}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                                >
                                                    View Mentor →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBookings;
