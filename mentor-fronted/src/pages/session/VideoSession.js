import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCircle, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import chatService from '../../services/chatService';
import chatApiService from '../../services/chatApiService';
import bookingService from '../../services/bookingService';
import authService from '../../services/authService';
import webrtcService from '../../services/webrtcService';

const VideoSession = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState(null);
    const [booking, setBooking] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connectionState, setConnectionState] = useState('new');
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [callStartTime, setCallStartTime] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const [hasRemoteStream, setHasRemoteStream] = useState(false);

    useEffect(() => {
        initializeVideoSession();

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

    const initializeVideoSession = async () => {
        try {
            setLoading(true);

            // Check WebRTC support
            if (!webrtcService.constructor.isSupported()) {
                throw new Error('Your browser does not support video calls. Please use a modern browser like Chrome, Firefox, or Safari.');
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
                throw new Error('Failed to create video room');
            }
            setRoom(roomResponse.data);

            // Connect to Socket.io
            const token = localStorage.getItem('token');
            chatService.connect(token);

            // Join room and wait for confirmation
            console.log('🚪 Attempting to join room...');
            await chatService.joinRoom(roomResponse.data._id);
            console.log('✅ Room joined successfully, setting up WebRTC...');

            // Initialize WebRTC
            const localStream = await webrtcService.initialize(
                roomResponse.data._id,
                true, // isVideo
                handleRemoteStream,
                handleConnectionStateChange
            );

            // Display local video
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }

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
            console.error('Error initializing video session:', err);
            setError(err.message || 'Failed to start video session');
            setLoading(false);
        }
    };

    const handleRemoteStream = (stream) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
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

    const toggleVideo = () => {
        const enabled = webrtcService.toggleVideo();
        setVideoEnabled(enabled);
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
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-xl text-white">Starting video session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-xl text-red-500 mb-6">{error}</p>
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
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            {/* Header */}
            <div className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={endCall}
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <FaArrowLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {otherUser?.name || 'Video Call'}
                            </h1>
                            {booking && (
                                <p className="text-xs text-neutral-400">
                                    {new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • {booking.startTime} - {booking.endTime}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                            <FaCircle className={`text-xs ${connected ? 'text-green-500' : 'text-red-500'}`} />
                            <span>{connectionState === 'connected' ? 'Connected' : connectionState}</span>
                        </div>
                        {callStartTime && (
                            <div className="text-white font-mono text-lg">
                                {formatDuration(callDuration)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative">
                {/* Remote Video (Full Screen) */}
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover bg-neutral-900"
                />

                {/* Remote Video Placeholder */}
                {!hasRemoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                {otherUser?.name?.charAt(0).toUpperCase() || 'M'}
                            </div>
                            <p className="text-white text-lg mb-4">Waiting for {otherUser?.name || 'mentor'}...</p>
                            <p className="text-neutral-400 text-sm mb-6">Status: {connectionState}</p>

                            {/* Manual Retry Button */}
                            <button
                                onClick={() => {
                                    console.log('🔄 Manually retrying connection...');
                                    webrtcService.createOffer();
                                }}
                                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm transition-colors"
                            >
                                Retry Connection
                            </button>
                        </div>
                    </div>
                )}

                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-64 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-700">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ transform: 'scaleX(-1)' }}
                        className="w-full h-full object-cover bg-neutral-800"
                    />
                    {!videoEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                            <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                You
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-neutral-900/80 backdrop-blur-md border-t border-neutral-800 px-6 py-6">
                <div className="max-w-4xl mx-auto flex justify-center gap-4">
                    {/* Microphone Toggle */}
                    <button
                        onClick={toggleAudio}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${audioEnabled
                            ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                    >
                        {audioEnabled ? <FaMicrophone className="text-xl" /> : <FaMicrophoneSlash className="text-xl" />}
                    </button>

                    {/* Camera Toggle */}
                    <button
                        onClick={toggleVideo}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoEnabled
                            ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
                    >
                        {videoEnabled ? <FaVideo className="text-xl" /> : <FaVideoSlash className="text-xl" />}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={endCall}
                        className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all"
                        title="End call"
                    >
                        <FaPhoneSlash className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoSession;
