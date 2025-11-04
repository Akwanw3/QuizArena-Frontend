import { create } from 'zustand';
import type { Room, Question, GameResult, Player } from '../types/Index';

interface GameState {
  currentRoom: Room | null;
  currentQuestion: Question | null;
  gameResults: GameResult[] | null;
  timeRemaining: number;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  
  setCurrentRoom: (room: Room | null  | ((prev: Room | null) => Room | null)) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setGameResults: (results: GameResult[]) => void;
  setTimeRemaining: (time: number) => void;
  setHasAnswered: (answered: boolean) => void;
  setSelectedAnswer: (answer: string | null) => void;
  resetGame: () => void;
  updatePlayerInRoom: (userId: string, updates: Partial<Player>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentRoom: null,
  currentQuestion: null,
  gameResults: null,
  timeRemaining: 0,
  hasAnswered: false,
  selectedAnswer: null,

  setCurrentRoom: (roomOrUpdater) =>
  set((state) => ({
    currentRoom:
      typeof roomOrUpdater === 'function'
        ? roomOrUpdater(state.currentRoom)
        : roomOrUpdater,
  })),
  
  setCurrentQuestion: (question) => 
    set({ 
      currentQuestion: question,
      hasAnswered: false,
      selectedAnswer: null,
      timeRemaining: question?.timeLimit || 0
    }),
  
  setGameResults: (results) => set({ gameResults: results }),
  
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  
  setHasAnswered: (answered) => set({ hasAnswered: answered }),
  
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  
  resetGame: () =>
    set({
      currentRoom: null,
      currentQuestion: null,
      gameResults: null,
      timeRemaining: 0,
      hasAnswered: false,
      selectedAnswer: null,
    }),

  updatePlayerInRoom: (userId, updates) =>
    set((state) => {
      if (!state.currentRoom) return state;
      
      const updatedPlayers = state.currentRoom.players.map((player) =>
        player.userId === userId ? { ...player, ...updates } : player
      );

      return {
        currentRoom: {
          ...state.currentRoom,
          players: updatedPlayers,
        },
      };
    }),
}));