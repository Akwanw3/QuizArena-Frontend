// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  stats: UserStats;
  isVerified?: boolean;
  createdAt?: string;
}

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  totalPoints: number;
  winRate: number;
  highestScore?: number;
  longestStreak?: number;
  perfectGames?: number;
}

// Room types
export interface Room {
  _id: string;
  roomCode: string;
  hostId: string;
  players: Player[];
  settings: RoomSettings;
  status: 'waiting' | 'playing' | 'finished';
  currentQuestion?: number;
  isPublic: boolean;
  createdAt: string;
}

export interface Player {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  answers: Answer[];
  isReady: boolean;
  isConnected: boolean;
  hasAnswered: boolean;
}

export interface RoomSettings {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  timePerQuestion: number;
}

export interface Answer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeToAnswer: number;
  pointsEarned: number;
}

// Game types
export interface Question {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: string[];
  category: string;
  difficulty: string;
  timeLimit: number;
}

export interface GameResult {
  userId: string;
  username: string;
  finalScore: number;
  accuracy: number;
  averageTimeToAnswer: number;
  fastestAnswer: number;
  rank: number;
}

export interface Game {
  _id: string;
  roomId: string;
  players: GameResult[];
  winner: string;
  settings: RoomSettings;
  finishedAt: string;
  duration: number;
}

// Achievement types
export interface Achievement {
  _id: string;
  userId: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress: number;
}

export interface AchievementProgress {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  unlocked: boolean;
  unlockedAt: string | null;
  canUnlock: boolean;
}

// Activity types
export interface Activity {
  _id: string;
  userId: string;
  username: string;
  avatar?: string;
  type: 'game_won' | 'game_played' | 'achievement_unlocked' | 'high_score';
  description: string;
  metadata?: any;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  user: User;
  token: string;
   requiresVerification: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface CreateRoomForm {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  timePerQuestion: number;
  isPublic: boolean;
}

// Add notification types
export interface Notification {
  _id: string;
  userId: string;
  type: 'game_invite' | 'achievement' | 'leaderboard' | 'system' | 'friend_request';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationSettings {
  gameInvites: boolean;
  achievements: boolean;
  leaderboard: boolean;
  email: boolean;
}