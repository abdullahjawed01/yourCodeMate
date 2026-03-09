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
  // Extended gamification fields
  xp?: number;
  rank?: number;
  avatar?: string;
  bio?: string;
  country?: string;
  university?: string;
  friends?: string[];
  following?: string[];
  followers?: string[];
  solvedProblems?: SolvedProblem[];
  languageStats?: Record<string, number>;
  contestRating?: number;
  accuracy?: number;
  joinedAt?: string;
  github?: string;
  linkedin?: string;
}

export interface SolvedProblem {
  problemId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  solvedAt: string;
  runtime?: number;
  memory?: number;
}

export interface FriendEntry {
  _id: string;
  name: string;
  level: number;
  points: number;
  avatar?: string;
  streak: number;
  online?: boolean;
  mutualCount?: number;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  type: 'solved' | 'badge' | 'contest' | 'streak' | 'rank';
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  reactions?: Record<string, string[]>;
  replyTo?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'dm' | 'group' | 'coding-room';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  unlocked: boolean;
  xpReward: number;
}

export interface BattleRoom {
  id: string;
  mode: 'speed' | 'accuracy' | 'timed';
  status: 'lobby' | 'active' | 'finished';
  participants: BattleParticipant[];
  problem?: string;
  timeLimit?: number;
  startedAt?: string;
}

export interface BattleParticipant {
  userId: string;
  name: string;
  status: 'waiting' | 'coding' | 'submitted';
  score?: number;
  submittedAt?: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'finished';
  participants: number;
  problems: string[];
  prizePool?: string;
  type: 'regular' | 'hackathon' | 'daily';
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  tags: string[];
  upvotes: number;
  replies: number;
  createdAt: string;
  problemId?: string;
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

export interface DashboardData extends Partial<User> {
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


