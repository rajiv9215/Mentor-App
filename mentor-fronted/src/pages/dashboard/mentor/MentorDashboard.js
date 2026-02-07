import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle,
    FaChartLine, FaDollarSign, FaUsers, FaEdit, FaComments, FaVideo, FaPhone
} from 'react-icons/fa';
import Button from '../../../components/Btncomponent';
import bookingService from '../../../services/bookingService';
import chatApiService from '../../../services/chatApiService';
import authService from '../../../services/authService';

const MentorDashboard = () => {
    const user = useSelector((store) => store.user?.user);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [bookings, setBookings] = useState([]);
    const [chatRooms, setChatRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                bookingService.getMentorBookings(),
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

    const getSortedBookings = () => {
        return [...bookings].sort((a, b) => {
            // Sort by lastMessageTime first if available (active chats top)
            const roomA = chatRooms[a._id];
            const roomB = chatRooms[b._id];

            const timeA = roomA?.lastMessageTime ? roomA.lastMessageTime.getTime() : 0;
            const timeB = roomB?.lastMessageTime ? roomB.lastMessageTime.getTime() : 0;

            if (timeA !== timeB) {
                return timeB - timeA; // Descending (newest message first)
            }

            // Fallback to booking date
            return new Date(b.date) - new Date(a.date);
        });
    };

    const sortedBookings = getSortedBookings();

    const getStats = () => {
        const now = new Date();

        const totalSessions = bookings.filter(b => b.status === 'completed').length;

        const upcomingBookings = bookings.filter(b => {
            if (b.status === 'confirmed') {
                const bookingDate = new Date(b.date);
                const [endHour, endMinute] = b.endTime.split(':').map(Number);
                const bookingEnd = new Date(bookingDate);
                bookingEnd.setHours(endHour, endMinute, 0, 0);
                return bookingEnd > now;
            }
            return false;
        }).length;

        const totalEarnings = bookings
            .filter(b => b.status === 'completed' && b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.price, 0);

        return { totalSessions, upcomingBookings, totalEarnings };
    };

    const stats = getStats();

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (!user || user.role !== 'mentor') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
                <p className="text-xl text-neutral-600 dark:text-neutral-400">Access Denied. Mentors only.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Mentor Dashboard</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Welcome back, {user.name}!</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl text-primary-600 dark:text-primary-400">
                                <FaChartLine />
                            </div>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                                All Time
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{stats.totalSessions}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Sessions</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl text-secondary-600 dark:text-secondary-400">
                                <FaCalendarAlt />
                            </div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                                Upcoming
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{stats.upcomingBookings}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Upcoming Bookings</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl text-accent-600 dark:text-accent-400">
                                <FaDollarSign />
                            </div>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                                Earned
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">₹{stats.totalEarnings}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Earnings</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'overview'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'bookings'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Bookings ({bookings.length})
                    </button>
                    <Link to="/mentor/availability">
                        <button
                            className="px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                            Manage Availability
                        </button>
                    </Link>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Recent Bookings</h2>
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <FaUsers className="text-6xl text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                                    <p className="text-neutral-600 dark:text-neutral-400">No bookings yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedBookings.slice(0, 5).map((booking) => (
                                        <div key={booking._id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                                                    <FaUsers className="text-primary-600 dark:text-primary-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-neutral-900 dark:text-white">
                                                        {booking.userId?.name || 'User'}
                                                    </p>
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                        {formatDate(booking.date)} • {booking.startTime} - {booking.endTime}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">All Bookings</h2>
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-neutral-600 dark:text-neutral-400">Loading bookings...</p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-12">
                                <FaCalendarAlt className="text-6xl text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                                <p className="text-neutral-600 dark:text-neutral-400">No bookings found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sortedBookings.map((booking) => (
                                    <div key={booking._id} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                                            {booking.userId?.name || 'User'}
                                                        </h3>
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                            {booking.userId?.email || 'No email'}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                                                        <FaClock className="text-primary-600" />
                                                        <span>{formatDate(booking.date)} • {booking.startTime} - {booking.endTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaDollarSign className="text-primary-600" />
                                                        <span>₹{booking.price} • {booking.paymentStatus}</span>
                                                    </div>
                                                </div>

                                                {booking.notes && (
                                                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 italic">
                                                        Note: {booking.notes}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            {booking.status === 'confirmed' && (
                                                <div className="flex flex-col gap-2 lg:ml-4">
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
                                                                <>
                                                                    <button
                                                                        onClick={() => !isDisabled && navigate(`/session/chat/${booking._id}`)}
                                                                        disabled={isDisabled}
                                                                        title={title}
                                                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${isDisabled
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
                                                                    <span className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                                                                        Chat Session
                                                                    </span>
                                                                </>
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
                                                                <>
                                                                    <button
                                                                        onClick={() => !isDisabled && navigate(`/session/video/${booking._id}`)}
                                                                        disabled={isDisabled}
                                                                        title={title}
                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${isDisabled
                                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500'
                                                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                                                            }`}
                                                                    >
                                                                        <FaVideo />
                                                                        Start Video
                                                                    </button>
                                                                    <span className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                                                                        Video Session
                                                                    </span>
                                                                </>
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
                                                                <>
                                                                    <button
                                                                        onClick={() => !isDisabled && navigate(`/session/call/${booking._id}`)}
                                                                        disabled={isDisabled}
                                                                        title={title}
                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${isDisabled
                                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500'
                                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                                            }`}
                                                                    >
                                                                        <FaPhone />
                                                                        Start Call
                                                                    </button>
                                                                    <span className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                                                                        Call Session
                                                                    </span>
                                                                </>
                                                            );
                                                        })()
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorDashboard;
