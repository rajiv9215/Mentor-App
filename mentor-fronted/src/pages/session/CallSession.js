import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCircle, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaVolumeUp } from 'react-icons/fa';
import chatService from '../../services/chatService';
import chatApiService from '../../services/chatApiService';
import bookingService from '../../services/bookingService';
import authService from '../../services/authService';
import webrtcService from '../../services/webrtcService';

const CallSession = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const remoteAudioRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState(null);
    const [booking, setBooking] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connectionState, setConnectionState] = useState('new');
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [callStartTime, setCallStartTime] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const [hasRemoteStream, setHasRemoteStream] = useState(false);

    useEffect(() => {
        initializeCallSession();

        return () => {
            webrtcService.endCall();
            chatService.removeAllListeners();
            chatService.disconnect();
        };
    }, [bookingId]);

    // Call duration timer
    useEffect(() => {
        let interval;
        if (callStartTime) {
            interval = setInterval(() => {
                setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStartTime]);

    const initializeCallSession = async () => {
        try {
            setLoading(true);

            // Check WebRTC support
            if (!webrtcService.constructor.isSupported()) {
                throw new Error('Your browser does not support audio calls. Please use a modern browser like Chrome, Firefox, or Safari.');
            }

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
                throw new Error('Failed to create call room');
            }
            setRoom(roomResponse.data);

            // Connect to Socket.io
            const token = localStorage.getItem('token');
            chatService.connect(token);

            // Join room and wait for confirmation
            console.log('🚪 Attempting to join room...');
            await chatService.joinRoom(roomResponse.data._id);
            console.log('✅ Room joined successfully, setting up WebRTC...');

            // Initialize WebRTC (audio only)
            await webrtcService.initialize(
                roomResponse.data._id,
                false, // isVideo = false for audio-only
                handleRemoteStream,
                handleConnectionStateChange
            );

            // Determine if current user should initiate the call
            // Only the user (who booked) should create the offer, not the mentor
            // Improved detection: check both _id and email for mentor identification
            let isMentor = false;

            // Check if mentor ID matches current user ID
            if (bookingResponse.data.mentorId._id === currentUserId ||
                bookingResponse.data.mentorId === currentUserId) {
                isMentor = true;
            }

            // Also check by email for more robust detection
            const currentUserProfile = await authService.getCurrentUser();
            if (currentUserProfile.data?.email &&
                bookingResponse.data.mentorId.email === currentUserProfile.data.email) {
                isMentor = true;
            }

            console.log('🎯 Current user is:', isMentor ? 'MENTOR' : 'USER');
            console.log('🎯 Current user ID:', currentUserId);
            console.log('🎯 Mentor ID:', bookingResponse.data.mentorId._id || bookingResponse.data.mentorId);
            console.log('🎯 Will create offer:', !isMentor);

            // Only the booking user creates the offer
            if (!isMentor) {
                setTimeout(() => {
                    console.log('📞 User initiating call...');
                    webrtcService.createOffer();
                }, 1500); // Delay to ensure mentor has time to join
            } else {
                console.log('⏳ Mentor waiting for offer...');
            }

            setConnected(true);
            setCallStartTime(Date.now());
            setLoading(false);
        } catch (err) {
            console.error('Error initializing call session:', err);
            setError(err.message || 'Failed to start call');
            setLoading(false);
        }
    };

    const handleRemoteStream = (stream) => {
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = stream;
            setHasRemoteStream(true);
        }
    };

    const handleConnectionStateChange = (state) => {
        setConnectionState(state);
        if (state === 'connected') {
            setConnected(true);
        } else if (state === 'disconnected' || state === 'failed') {
            setConnected(false);
        }
    };

    const toggleAudio = () => {
        const enabled = webrtcService.toggleAudio();
        setAudioEnabled(enabled);
    };

    const endCall = () => {
        webrtcService.endCall();
        navigate('/bookings');
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400">Starting call...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-xl text-red-600 mb-6">{error}</p>
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

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            {/* Hidden audio element for remote stream */}
            <audio ref={remoteAudioRef} autoPlay />

            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={endCall}
                            className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors"
                        >
                            <FaArrowLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                                {otherUser?.name || 'Audio Call'}
                            </h1>
                            {booking && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • {booking.startTime} - {booking.endTime}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <FaCircle className={`text-xs ${connected ? 'text-green-500' : 'text-red-500'}`} />
                            <span>{connectionState === 'connected' ? 'Connected' : connectionState}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call Area */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    {/* User Avatar */}
                    <div className="w-40 h-40 bg-primary-600 rounded-full flex items-center justify-center text-white text-6xl font-bold mx-auto mb-6 shadow-2xl">
                        {otherUser?.name?.charAt(0).toUpperCase() || 'M'}
                    </div>

                    {/* User Name */}
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        {otherUser?.name || 'Mentor'}
                    </h2>

                    {/* Call Status */}
                    <div className="mb-6">
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
                            {connectionState === 'connected' ? 'Call in progress' : 'Connecting...'}
                        </p>
                        {connectionState !== 'connected' && (
                            <button
                                onClick={() => {
                                    console.log('🔄 Manually retrying connection...');
                                    webrtcService.createOffer();
                                }}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium underline"
                            >
                                Retry Connection
                            </button>
                        )}
                    </div>

                    {/* Call Duration */}
                    {callStartTime && (
                        <div className="text-5xl font-mono font-bold text-primary-600 dark:text-primary-400 mb-8">
                            {formatDuration(callDuration)}
                        </div>
                    )}

                    {/* Audio Indicator */}
                    {connected && (
                        <div className="flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
                            <FaVolumeUp className="text-xl" />
                            <span className="text-sm">Audio connected</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-8">
                <div className="max-w-4xl mx-auto flex justify-center gap-6">
                    {/* Microphone Toggle */}
                    <button
                        onClick={toggleAudio}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${audioEnabled
                            ? 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                    >
                        {audioEnabled ? <FaMicrophone className="text-2xl" /> : <FaMicrophoneSlash className="text-2xl" />}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={endCall}
                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all shadow-lg"
                        title="End call"
                    >
                        <FaPhoneSlash className="text-2xl" />
                    </button>
                </div>

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
                    {audioEnabled ? 'Microphone is on' : 'Microphone is muted'}
                </p>
            </div>
        </div>
    );
};

export default CallSession;
