import api from './Api';

export const gameService = {
  // Start game (host only)
  startGame: async (roomCode: string) => {
    const response = await api.post(`/games/${roomCode}/start`);
    return response.data;
  },

  // Submit answer
  submitAnswer: async (roomCode: string, answer: string) => {
    const response = await api.post(`/games/${roomCode}/answer`, { answer });
    return response.data;
  },

  // Get game results
  getGameResults: async (gameId: string) => {
    const response = await api.get(`/games/${gameId}/results`);
    return response.data.data;
  },

  // Get game history
  getGameHistory: async (limit: number = 10) => {
    const response = await api.get('/games/history', { params: { limit } });
    return response.data.data;
  },

  // Get leaderboard
  getLeaderboard: async (limit: number = 100) => {
    const response = await api.get('/games/leaderboard', { params: { limit } });
    return response.data.data;
  },
};