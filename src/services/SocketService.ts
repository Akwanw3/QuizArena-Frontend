import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private currentUserId: string | null = null;

  connect(token: string, userId: string) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.currentUserId = userId;
    
    this.socket = io(socketUrl, {
      transports: ['websocket'], // Add polling as fallback
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    // Authenticate immediately
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.socket?.emit('auth:authenticate', token);
      
      // Join user's personal room for notifications
      if (this.currentUserId) {
        this.socket?.emit('user:join', this.currentUserId);
      }
    });

    this.socket.on('auth:success', () => {
      console.log('✅ Socket authenticated');
    });

    this.socket.on('auth:error', (data: any) => {
      console.error('❌ Socket auth error:', data.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.currentUserId = null;
  }

  // Join a room
  joinRoom(roomCode: string) {
    console.log('📍 Joining room:', roomCode);
    this.socket?.emit('room:join', roomCode);
  }

  // Leave a room
  leaveRoom() {
    console.log('📍 Leaving room');
    this.socket?.emit('room:leave');
  }

  // Listen to events
  on<T = any>(event: string, callback: (data: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    this.socket?.on(event, callback);
    console.log('👂 Listening to:', event);
  }

  // Remove listener
  off(event: string, callback?: Function) {
    if (callback) {
      this.socket?.off(event, callback as any);
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      }
    } else {
      this.socket?.off(event);
      this.listeners.delete(event);
    }
    console.log('🔇 Stopped listening to:', event);
  }

  // Emit event
  emit(event: string, data?: any) {
    console.log('📤 Emitting:', event, data);
    this.socket?.emit(event, data);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();