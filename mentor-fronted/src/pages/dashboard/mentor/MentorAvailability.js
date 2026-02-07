import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Btncomponent';
import bookingService from '../../../services/bookingService';
import mentorService from '../../../services/mentorService';
import { FaPlus, FaTrash, FaComments, FaPhone, FaVideo, FaArrowLeft } from 'react-icons/fa';

const MentorAvailability = () => {
    const user = useSelector((store) => store.user?.user);
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Get today's day name
    const getTodayDayName = () => {
        const today = new Date();
        const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        // Convert to our days array format (Monday = 0)
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        return days[adjustedIndex];
    };

    // New slot state
    const [isRecurring, setIsRecurring] = useState(true);
    const [day, setDay] = useState(getTodayDayName());
    const [specificDate, setSpecificDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [sessionTypes, setSessionTypes] = useState(['video']); // Default to video


    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                setLoading(true);
                const response = await mentorService.getMyMentorProfile();
                if (response.success && response.data.slots) {
                    setSlots(response.data.slots);
                }
            } catch (error) {
                console.error("Error fetching availability:", error);
                // If error, just start with empty slots
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'mentor') {
            fetchAvailability();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleAddSlot = () => {
        if (sessionTypes.length === 0) {
            setMessage({ text: 'Please select at least one session type', type: 'error' });
            return;
        }

        let newSlot = { startTime, endTime, isBooked: false, sessionTypes };

        if (isRecurring) {
            newSlot.day = day;
        } else {
            if (!specificDate) {
                setMessage({ text: 'Please select a date', type: 'error' });
                return;
            }
            newSlot.date = new Date(specificDate);
            // Optional: Set day based on date for consistency/fallback
            const d = new Date(specificDate);
            const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1]; // Adjust for Sunday=0
            newSlot.day = dayName;
        }

        setSlots([...slots, newSlot]);
        setSessionTypes(['video']); // Reset to default
        // Reset inputs
        if (!isRecurring) setSpecificDate('');
    };

    const handleRemoveSlot = (index) => {
        const slotToRemove = slots[index];

        // Prevent deletion of booked slots
        if (slotToRemove.isBooked) {
            setMessage({
                text: 'Cannot delete a booked slot. Please cancel the booking first from your bookings dashboard.',
                type: 'error'
            });
            return;
        }

        // Confirmation dialog
        const slotDescription = slotToRemove.date
            ? `${new Date(slotToRemove.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} ${slotToRemove.startTime} - ${slotToRemove.endTime}`
            : `${slotToRemove.day} ${slotToRemove.startTime} - ${slotToRemove.endTime}`;

        if (!window.confirm(`Are you sure you want to delete this slot?\n\n${slotDescription}`)) {
            return;
        }

        const newSlots = [...slots];
        newSlots.splice(index, 1);
        setSlots(newSlots);
        setMessage({ text: 'Slot removed. Click "Save Changes" to update.', type: 'success' });
    };

    const handleSessionTypeToggle = (type) => {
        setSessionTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setMessage({ text: '', type: '' }); // Clear previous messages
            const response = await bookingService.updateAvailability(slots);
            if (response) {
                setMessage({ text: 'Availability updated successfully!', type: 'success' });
            }
            setLoading(false);
        } catch (error) {
            console.error("Error updating availability:", error);

            // Display backend error message if available
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update availability.';
            setMessage({ text: errorMessage, type: 'error' });
            setLoading(false);
        }
    };

    const getSessionIcon = (type) => {
        switch (type) {
            case 'chat': return <FaComments className="inline" />;
            case 'call': return <FaPhone className="inline" />;
            case 'video': return <FaVideo className="inline" />;
            default: return null;
        }
    };

    const getSessionBadge = (type) => {
        const badges = {
            chat: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            call: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            video: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
        };
        return badges[type] || 'bg-gray-100 text-gray-700';
    };

    if (!user || user.role !== 'mentor') {
        return <div className="p-10 text-center">Access Denied. Mentors only.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Go back"
                >
                    <FaArrowLeft className="text-xl text-neutral-600 dark:text-neutral-400" />
                </button>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Manage Availability</h2>
            </div>

            {message.text && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-700">
                <button
                    onClick={() => setIsRecurring(true)}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${isRecurring
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                >
                    📅 Recurring Availability
                </button>
                <button
                    onClick={() => setIsRecurring(false)}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${!isRecurring
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                >
                    📆 Specific Date
                </button>
            </div>

            {/* Recurring Availability Tab */}
            {isRecurring && (
                <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg mb-8">
                    <h3 className="font-semibold mb-4 text-neutral-800 dark:text-white">Manage Daily Availability</h3>

                    {/* Day Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Select Day</label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full md:w-64 p-3 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white font-medium"
                        >
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Session Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Select Session Types for New Slots</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sessionTypes.includes('chat')}
                                    onChange={() => handleSessionTypeToggle('chat')}
                                    className="w-4 h-4"
                                />
                                <span className="text-neutral-700 dark:text-neutral-300"><FaComments className="inline mr-1" /> Chat</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sessionTypes.includes('call')}
                                    onChange={() => handleSessionTypeToggle('call')}
                                    className="w-4 h-4"
                                />
                                <span className="text-neutral-700 dark:text-neutral-300"><FaPhone className="inline mr-1" /> Call</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sessionTypes.includes('video')}
                                    onChange={() => handleSessionTypeToggle('video')}
                                    className="w-4 h-4"
                                />
                                <span className="text-neutral-700 dark:text-neutral-300"><FaVideo className="inline mr-1" /> Video</span>
                            </label>
                        </div>
                    </div>

                    {/* Time Slots Grid for Selected Day */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">
                            Available Time Slots for {day}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'].map(timeSlot => {
                                const [start, end] = timeSlot.split('-');

                                // Format time for display
                                const formatTime = (time) => {
                                    const [hours, minutes] = time.split(':');
                                    const hour = parseInt(hours);
                                    const ampm = hour >= 12 ? 'PM' : 'AM';
                                    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                                    return `${displayHour}:${minutes} ${ampm}`;
                                };

                                const existingSlot = slots.find(s =>
                                    s.day === day &&
                                    s.startTime === start &&
                                    s.endTime === end &&
                                    !s.date // Only recurring slots
                                );
                                const isBooked = existingSlot?.isBooked;
                                const hasSlot = !!existingSlot;

                                return (
                                    <button
                                        key={timeSlot}
                                        onClick={() => {
                                            if (isBooked) {
                                                setMessage({ text: 'Cannot modify booked slots', type: 'error' });
                                                return;
                                            }

                                            if (sessionTypes.length === 0) {
                                                setMessage({ text: 'Please select at least one session type', type: 'error' });
                                                return;
                                            }

                                            if (hasSlot) {
                                                // Remove slot
                                                const index = slots.findIndex(s =>
                                                    s.day === day &&
                                                    s.startTime === start &&
                                                    s.endTime === end &&
                                                    !s.date
                                                );
                                                if (index !== -1) {
                                                    handleRemoveSlot(index);
                                                }
                                            } else {
                                                // Add slot
                                                const newSlot = {
                                                    day,
                                                    startTime: start,
                                                    endTime: end,
                                                    isBooked: false,
                                                    sessionTypes: [...sessionTypes]
                                                };
                                                setSlots([...slots, newSlot]);
                                                setMessage({ text: 'Slot added. Click "Save Changes" to update.', type: 'success' });
                                            }
                                        }}
                                        className={`p-4 rounded-lg text-sm font-medium transition-all border-2 ${isBooked
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700 cursor-not-allowed'
                                            : hasSlot
                                                ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-sm'
                                                : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                                            }`}
                                        title={isBooked ? 'Booked - Cannot modify' : hasSlot ? 'Click to remove' : 'Click to add'}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-xs opacity-75">
                                                {formatTime(start)}
                                            </div>
                                            <div className="text-lg">
                                                {isBooked ? '🔒' : hasSlot ? '✓' : '+'}
                                            </div>
                                            <div className="text-xs opacity-75">
                                                {formatTime(end)}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <p>💡 Click on time slots to add/remove availability. Green = Available, Red = Booked, White = Empty</p>
                    </div>
                </div>
            )}

            {/* Specific Date Tab */}
            {!isRecurring && (
                <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg mb-8">
                    <h3 className="font-semibold mb-4 text-neutral-800 dark:text-white">Add Specific Date Slot</h3>

                    {/* Session Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Select Session Types</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sessionTypes.includes('chat')}
                                    onChange={() => handleSessionTypeToggle('chat')}
                                    className="w-4 h-4"
                                />
                                <span className="text-neutral-700 dark:text-neutral-300"><FaComments className="inline mr-1" /> Chat</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sessionTypes.includes('call')}
                                    onChange={() => handleSessionTypeToggle('call')}
                                    className="w-4 h-4"
                                />
                                <span className="text-neutral-700 dark:text-neutral-300"><FaPhone className="inline mr-1" /> Call</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sessionTypes.includes('video')}
                                    onChange={() => handleSessionTypeToggle('video')}
                                    className="w-4 h-4"
                                />
                                <span className="text-neutral-700 dark:text-neutral-300"><FaVideo className="inline mr-1" /> Video</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-600 dark:text-neutral-300">Date</label>
                            <input
                                type="date"
                                value={specificDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSpecificDate(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-600 dark:text-neutral-300">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-600 dark:text-neutral-300">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    if (!specificDate) {
                                        setMessage({ text: 'Please select a date', type: 'error' });
                                        return;
                                    }
                                    if (sessionTypes.length === 0) {
                                        setMessage({ text: 'Please select at least one session type', type: 'error' });
                                        return;
                                    }

                                    // Check if date is in the past
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const selectedDate = new Date(specificDate);
                                    if (selectedDate < today) {
                                        setMessage({ text: 'Cannot add slots for past dates', type: 'error' });
                                        return;
                                    }

                                    const newSlot = {
                                        date: selectedDate,
                                        day: days[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1],
                                        startTime,
                                        endTime,
                                        isBooked: false,
                                        sessionTypes: [...sessionTypes]
                                    };
                                    setSlots([...slots, newSlot]);
                                    setSpecificDate('');
                                    setMessage({ text: 'Specific date slot added. Click "Save Changes" to update.', type: 'success' });
                                }}
                                disabled={loading}
                                className="w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Slot
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-lg text-neutral-800 dark:text-white">Current Slots</h3>
                {slots.length === 0 ? (
                    <p className="text-neutral-500 italic">No slots added yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {slots.map((slot, index) => (
                            <div key={index} className="flex justify-between items-center p-4 border rounded dark:border-neutral-700 bg-white dark:bg-neutral-800">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-primary-600">
                                            {slot.date
                                                ? new Date(slot.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ` (${slot.day})`
                                                : slot.day}
                                        </span>
                                        <span className="text-neutral-600 dark:text-neutral-300">{slot.startTime} - {slot.endTime}</span>
                                        {slot.isBooked && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Booked</span>}
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {slot.sessionTypes && slot.sessionTypes.length > 0 ? (
                                            slot.sessionTypes.map((type, idx) => (
                                                <span key={idx} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getSessionBadge(type)}`}>
                                                    {getSessionIcon(type)} {type}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-neutral-400">No session types</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveSlot(index)}
                                    disabled={slot.isBooked}
                                    className={`p-2 ml-4 ${slot.isBooked
                                        ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                        }`}
                                    title={slot.isBooked ? 'Cannot delete booked slot' : 'Delete slot'}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div >
    );
};

export default MentorAvailability;
