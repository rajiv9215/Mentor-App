import { io } from 'socket.io-client';

class ChatService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(token) {
        if (this.socket && this.connected) {
            return this.socket;
        }

        // Use the backend URL (Socket.io connects to the same server as API)
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:7777';

        this.socket = io(backendUrl, {
            auth: {
                token
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected');
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            this.connected = false;
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    joinRoom(roomId) {
        return new Promise((resolve) => {
            if (this.socket) {
                // Listen for room joined confirmation
                this.socket.once('room_joined', (data) => {
                    console.log('✅ Joined room:', data.roomId);
                    resolve(data);
                });

                // Emit join room event
                console.log('🚪 Joining room:', roomId);
                this.socket.emit('join_room', { roomId });
            } else {
                resolve(null);
            }
        });
    }

    sendMessage(roomId, receiverId, message) {
        if (this.socket) {
            this.socket.emit('send_message', { roomId, receiverId, message });
        }
    }

    sendTyping(roomId, isTyping) {
        if (this.socket) {
            this.socket.emit('typing', { roomId, isTyping });
        }
    }

    markAsRead(roomId) {
        if (this.socket) {
            this.socket.emit('mark_read', { roomId });
        }
    }

    onNewMessage(callback) {
        if (this.socket) {
            this.socket.on('new_message', callback);
        }
    }

    onRoomHistory(callback) {
        if (this.socket) {
            this.socket.on('room_history', callback);
        }
    }

    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on('user_typing', callback);
        }
    }

    onMessagesRead(callback) {
        if (this.socket) {
            this.socket.on('messages_read', callback);
        }
    }

    // WebRTC Signaling Methods
    sendWebRTCSignal(type, data) {
        if (this.socket) {
            this.socket.emit(`webrtc_${type}`, data);
        }
    }

    onWebRTCSignal(type, callback) {
        if (this.socket) {
            this.socket.on(`webrtc_${type}`, callback);
        }
    }

    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

export default new ChatService();
