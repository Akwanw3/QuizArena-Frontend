import api from './Api';
import type { Room, CreateRoomForm } from '../types/Index';

export const roomService = {
  // Create new room
  createRoom: async (data: CreateRoomForm): Promise<Room> => {
    const response = await api.post('/rooms', data);
    return response.data.data.room;
  },

  // Get all public rooms
  getPublicRooms: async (filters?: { status?: string; difficulty?: string }) => {
    const response = await api.get('/rooms', { params: filters });
    return response.data.data;
  },

  // Get room by code
  getRoomByCode: async (roomCode: string): Promise<Room> => {
    const response = await api.get(`/rooms/${roomCode}`);
    return response.data.data.room;
  },

  // Join room
  joinRoom: async (roomCode: string): Promise<Room> => {
    const response = await api.post(`/rooms/${roomCode}/join`);
    return response.data.data.room;
  },

  // Leave room
  leaveRoom: async (roomCode: string) => {
    const response = await api.post(`/rooms/${roomCode}/leave`);
    return response.data;
  },

  // Toggle ready status
  toggleReady: async (roomCode: string) => {
    const response = await api.post(`/rooms/${roomCode}/ready`);
    return response.data;
  },

  // Update room settings (host only)
  updateSettings: async (roomCode: string, settings: Partial<CreateRoomForm>) => {
    const response = await api.put(`/rooms/${roomCode}/settings`, settings);
    return response.data.data.room;
  },

  // Delete room (host only)
  deleteRoom: async (roomCode: string) => {
    const response = await api.delete(`/rooms/${roomCode}`);
    return response.data;
  },
};