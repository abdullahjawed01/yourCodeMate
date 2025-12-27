export interface User {
  _id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  badges: string[];
  streak: number;
  lastActiveDate?: string;
  isAdmin: boolean;
  solvedTests: string[];
}

export interface CodingTest {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: Array<{ input: string; expectedOutput: string }>;
  maxScore: number;
  unlockLevel: number;
  hintCost: number;
  unlocked?: boolean;
  completed?: boolean;
  hints?: string[];
  estimatedTime?: number;
}

export interface Progress {
  _id: string;
  user: string;
  points: number;
  level: number;
  badges: string[];
  completedTests: string[];
  notifications: Array<{ message: string; createdAt: string }>;
  flags: number;
}

export interface DashboardData {
  points: number;
  level: number;
  badges: string[];
  notifications: Array<{ message: string; createdAt: string }>;
  tests: CodingTest[];
}

export interface LeaderboardEntry {
  _id: string;
  name: string;
  points: number;
  level: number;
  badges: string[];
  rank?: number;
}

export interface LearningPath {
  _id: string;
  title: string;
  description: string;
  level: number;
  tests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  _id: string;
  user: string;
  role: string;
  level: 'junior' | 'mid' | 'senior';
  questions: Array<{
    question: string;
    answer?: string;
    feedback?: string;
    score?: number;
  }>;
  totalScore: number;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface ApiError {
  message: string;
}


