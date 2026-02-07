import chatService from './chatService';

class WebRTCService {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.roomId = null;
        this.isInitiator = false;

        // WebRTC configuration with STUN servers
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
    }

    /**
     * Initialize WebRTC connection
     * @param {string} roomId - Chat room ID
     * @param {boolean} isVideo - Whether to enable video
     * @param {Function} onRemoteStream - Callback when remote stream is received
     * @param {Function} onConnectionStateChange - Callback for connection state changes
     */
    async initialize(roomId, isVideo = true, onRemoteStream, onConnectionStateChange) {
        try {
            console.log('🔧 Initializing WebRTC for room:', roomId);

            // Clean up any existing connection first
            this.cleanup();

            this.roomId = roomId;
            this.onRemoteStreamCallback = onRemoteStream;
            this.onConnectionStateChangeCallback = onConnectionStateChange;

            // Get local media stream
            this.localStream = await this.getLocalStream(isVideo);
            console.log('✅ Local stream obtained');

            // Create peer connection
            this.peerConnection = new RTCPeerConnection(this.configuration);
            console.log('✅ Peer connection created');

            // Add local stream tracks to peer connection
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            console.log('✅ Local tracks added to peer connection');

            // Handle remote stream
            this.peerConnection.ontrack = (event) => {
                console.log('📥 Received remote track:', event.track.kind);
                if (!this.remoteStream) {
                    this.remoteStream = new MediaStream();
                }
                this.remoteStream.addTrack(event.track);
                if (this.onRemoteStreamCallback) {
                    this.onRemoteStreamCallback(this.remoteStream);
                }
            };

            // Handle ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('📤 Sending ICE candidate');
                    chatService.sendWebRTCSignal('ice_candidate', {
                        roomId: this.roomId,
                        candidate: event.candidate
                    });
                }
            };

            // Handle connection state changes
            this.peerConnection.onconnectionstatechange = () => {
                console.log('🔄 Connection state:', this.peerConnection.connectionState);
                if (this.onConnectionStateChangeCallback) {
                    this.onConnectionStateChangeCallback(this.peerConnection.connectionState);
                }
            };

            // Set up WebRTC signaling listeners
            this.setupSignalingListeners();

            return this.localStream;
        } catch (error) {
            console.error('❌ Error initializing WebRTC:', error);
            throw error;
        }
    }

    /**
     * Get local media stream (camera and/or microphone)
     */
    async getLocalStream(isVideo = true) {
        try {
            const constraints = {
                audio: true,
                video: isVideo ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } : false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw new Error('Failed to access camera/microphone. Please grant permissions.');
        }
    }

    /**
     * Create and send WebRTC offer
     */
    async createOffer() {
        try {
            console.log('📤 Creating WebRTC offer for room:', this.roomId);
            this.isInitiator = true;
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            console.log('✅ Offer created and set as local description');

            chatService.sendWebRTCSignal('offer', {
                roomId: this.roomId,
                offer: offer
            });
            console.log('📤 Offer sent to peer');
        } catch (error) {
            console.error('❌ Error creating offer:', error);
            throw error;
        }
    }

    /**
     * Handle incoming WebRTC offer
     */
    async handleOffer(offer) {
        try {
            console.log('📥 Handling incoming offer');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            console.log('✅ Remote description set from offer');

            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            console.log('✅ Answer created and set as local description');

            chatService.sendWebRTCSignal('answer', {
                roomId: this.roomId,
                answer: answer
            });
            console.log('📤 Answer sent to peer');
        } catch (error) {
            console.error('❌ Error handling offer:', error);
            throw error;
        }
    }

    /**
     * Handle incoming WebRTC answer
     */
    async handleAnswer(answer) {
        try {
            console.log('📥 Handling incoming answer');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('✅ Remote description set from answer');
        } catch (error) {
            console.error('❌ Error handling answer:', error);
            throw error;
        }
    }

    /**
     * Handle incoming ICE candidate
     */
    async handleIceCandidate(candidate) {
        try {
            console.log('📥 Adding ICE candidate');
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('✅ ICE candidate added');
        } catch (error) {
            console.error('❌ Error adding ICE candidate:', error);
        }
    }

    /**
     * Set up WebRTC signaling listeners
     */
    setupSignalingListeners() {
        console.log('🔧 Setting up WebRTC signaling listeners for room:', this.roomId);

        // Remove any existing listeners to prevent duplicates
        if (chatService.socket) {
            chatService.socket.off('webrtc_offer');
            chatService.socket.off('webrtc_answer');
            chatService.socket.off('webrtc_ice_candidate');
        }

        // Set up new listeners
        chatService.onWebRTCSignal('offer', async ({ offer, senderId }) => {
            console.log('📥 Received offer from:', senderId, 'isInitiator:', this.isInitiator);
            console.log('📥 Current signaling state:', this.peerConnection?.signalingState);

            // Check if we're in a valid state to handle the offer
            if (!this.peerConnection) {
                console.error('❌ Cannot handle offer: peer connection not initialized');
                return;
            }

            // Handle WebRTC glare (both sides creating offers)
            if (this.isInitiator && this.peerConnection.signalingState !== 'stable') {
                console.log('⚠️ WebRTC glare detected - both sides created offers');
                // In case of glare, the side with lower ID backs off
                // For simplicity, we'll accept the incoming offer
            }

            try {
                await this.handleOffer(offer);
            } catch (error) {
                console.error('❌ Error handling offer:', error);
            }
        });

        chatService.onWebRTCSignal('answer', async ({ answer, senderId }) => {
            console.log('📥 Received answer from:', senderId, 'isInitiator:', this.isInitiator);
            console.log('📥 Current signaling state:', this.peerConnection?.signalingState);

            if (!this.peerConnection) {
                console.error('❌ Cannot handle answer: peer connection not initialized');
                return;
            }

            // Only handle answer if we're expecting one (we created the offer)
            if (this.peerConnection.signalingState === 'have-local-offer') {
                try {
                    await this.handleAnswer(answer);
                } catch (error) {
                    console.error('❌ Error handling answer:', error);
                }
            } else {
                console.log('⚠️ Ignoring answer - signaling state is:', this.peerConnection.signalingState);
            }
        });

        chatService.onWebRTCSignal('ice_candidate', async ({ candidate, senderId }) => {
            console.log('📥 Received ICE candidate from:', senderId);

            if (!this.peerConnection) {
                console.error('❌ Cannot handle ICE candidate: peer connection not initialized');
                return;
            }

            // Only add ICE candidates after remote description is set
            if (this.peerConnection.remoteDescription) {
                try {
                    await this.handleIceCandidate(candidate);
                } catch (error) {
                    console.error('❌ Error handling ICE candidate:', error);
                }
            } else {
                console.log('⚠️ Skipping ICE candidate - no remote description yet');
                // Could queue candidates here if needed
            }
        });
    }

    /**
     * Toggle microphone on/off
     */
    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return audioTrack.enabled;
            }
        }
        return false;
    }

    /**
     * Toggle camera on/off
     */
    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                return videoTrack.enabled;
            }
        }
        return false;
    }

    /**
     * Clean up resources without stopping streams (for reinitialization)
     */
    cleanup() {
        console.log('🧹 Cleaning up WebRTC resources');

        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        // Stop streams
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
        }

        // Reset state
        this.roomId = null;
        this.isInitiator = false;
        this.onRemoteStreamCallback = null;
        this.onConnectionStateChangeCallback = null;
    }

    /**
     * End call and clean up resources
     */
    endCall() {
        this.cleanup();
    }

    /**
     * Check if WebRTC is supported
     */
    static isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.RTCPeerConnection);
    }
}

export default new WebRTCService();
