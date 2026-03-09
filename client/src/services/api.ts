import api from '@/utils/api';
import type {
  User,
  CodingTest,
  DashboardData,
  LeaderboardEntry,
  LearningPath,
  AuthResponse,
} from '@/types';

// Auth APIs
export const authApi = {
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getMe: async (): Promise<{ message: string; user: User }> => {
    const response = await api.get('/me');
    return response.data;
  },
};

// User APIs
export const userApi = {
  updateProfile: async (data: { name?: string; bio?: string; country?: string; github?: string; linkedin?: string; }): Promise<any> => {
    const response = await api.put('/me/profile', data);
    return response.data;
  },
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}/dashboard`);
    return response.data;
  },
};

// Coding Test APIs
export const codingTestApi = {
  getAllTests: async (): Promise<CodingTest[]> => {
    const response = await api.get('/tests');
    return response.data;
  },
  submitSolution: async (data: { testId: string; code: string; language: string }): Promise<any> => {
    const response = await api.post('/tests/submit', data);
    return response.data;
  },
  createTest: async (data: Partial<CodingTest>): Promise<CodingTest> => {
    const response = await api.post('/tests/create', data);
    return response.data;
  },
};

// IDE APIs
export const ideApi = {
  runCode: async (data: { code: string; language: string }): Promise<any> => {
    const response = await api.post('/ide/run', data);
    return response.data;
  },
};

// AI Mentor APIs
export const aiMentorApi = {
  askMentor: async (data: { question: string; context?: string }): Promise<{ answer: string }> => {
    const response = await api.post('/mentor/ask', data);
    return response.data;
  },
};

// AI APIs
export const aiApi = {
  evaluateCode: async (data: { code: string; testId: string }): Promise<any> => {
    const response = await api.post('/ai/submit', data);
    return response.data;
  },
  explainCode: async (data: { code: string }): Promise<{ explanation: string }> => {
    const response = await api.post('/ai/explain', data);
    return response.data;
  },
};

// Dashboard APIs
export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getUserDashboard: async (userId: string): Promise<DashboardData> => {
    const response = await api.get(`/users/${userId}/dashboard`);
    return response.data;
  },
};

// Progress APIs
export const progressApi = {
  getProgress: async (): Promise<any> => {
    const response = await api.get('/progress/me');
    return response.data;
  },
  updateProgress: async (data: any): Promise<any> => {
    const response = await api.post('/progress/progress', data);
    return response.data;
  },
};

// Leaderboard APIs
export const leaderboardApi = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/leaderboard');
    return response.data;
  },
  getUserRank: async (): Promise<{ rank: number; user: LeaderboardEntry }> => {
    const response = await api.get('/leaderboard/me');
    return response.data;
  },
};

// Learning Path APIs
export const learningPathApi = {
  getAllPaths: async (): Promise<LearningPath[]> => {
    const response = await api.get('/paths');
    return response.data;
  },
  createPath: async (data: Partial<LearningPath>): Promise<LearningPath> => {
    const response = await api.post('/paths/create', data);
    return response.data;
  },
};

// Interview APIs
export const interviewApi = {
  startInterview: async (data: { role: string; level: 'junior' | 'mid' | 'senior' }): Promise<any> => {
    const response = await api.post('/interview/start', data);
    // Backend returns: { message, sessionId, question, session }
    // Use session if available, otherwise construct from response
    if (response.data.session) {
      return response.data.session;
    }
    // Fallback construction
    return {
      _id: response.data.sessionId,
      questions: [{ question: response.data.question, answer: '', feedback: '', score: 0 }],
      role: data.role,
      level: data.level,
      totalScore: 0,
    };
  },
  submitAnswer: async (data: { sessionId: string; questionIndex: number; answer: string }): Promise<any> => {
    // Backend expects { sessionId, answer } - not questionIndex
    const response = await api.post('/interview/answer', {
      sessionId: data.sessionId,
      answer: data.answer,
    });
    // Backend returns: { score, feedback, totalScore }
    // We need to fetch the full session or update local state
    return response.data;
  },
};

// Hint APIs
export const hintApi = {
  getHint: async (data: { testId: string }): Promise<{ hint: string }> => {
    const response = await api.post('/hint', data);
    return response.data;
  },
};

// Recommendation APIs
export const recommendationApi = {
  getRecommendation: async (userId: string): Promise<CodingTest> => {
    const response = await api.get(`/recommend/${userId}`);
    return response.data;
  },
};

// Test APIs
export const testApi = {
  getAllTests: async (): Promise<CodingTest[]> => {
    const response = await api.get('/test');
    return response.data;
  },
  getTestById: async (id: string): Promise<CodingTest> => {
    const response = await api.get(`/test/${id}`);
    return response.data;
  },
  getUserTests: async (): Promise<CodingTest[]> => {
    const response = await api.get('/test/dashboard');
    return response.data;
  },
};

// Path APIs
export const pathApi = {
  getAvailableTests: async (): Promise<CodingTest[]> => {
    const response = await api.get('/path/tests');
    return response.data;
  },
};

// Gamification APIs
export const gamificationApi = {
  updateProgress: async (data: any): Promise<any> => {
    const response = await api.post('/gamification/update', data);
    return response.data;
  },
};

// Admin APIs
export const adminApi = {
  createTest: async (data: Partial<CodingTest>): Promise<CodingTest> => {
    const response = await api.post('/admin/test', data);
    return response.data;
  },
  updateTest: async (id: string, data: Partial<CodingTest>): Promise<CodingTest> => {
    const response = await api.put(`/admin/test/${id}`, data);
    return response.data;
  },
  deleteTest: async (id: string): Promise<void> => {
    const response = await api.delete(`/admin/test/${id}`);
    return response.data;
  },
};

// Learning APIs (Unified)
export const learningApi = {
  getTopics: async (language: string): Promise<any> => {
    const response = await api.get(`/learn/${language}/topics`);
    return response.data;
  },
  getTopic: async (language: string, slug: string): Promise<any> => {
    const response = await api.get(`/learn/${language}/topics/${slug}`);
    return response.data;
  },
  completeTopic: async (language: string, topicId: string): Promise<any> => {
    const response = await api.post(`/learn/${language}/topics/${topicId}/complete`);
    return response.data;
  },
};

// Social APIs
export const socialApi = {
  getFriends: async (): Promise<any> => {
    const response = await api.get('/social/friends');
    return response.data;
  },
};




// Battle APIs
export const battleApi = {
  getLobby: async (): Promise<any> => {
    const response = await api.get('/games/battles');
    return response.data;
  },
};

// Contest APIs
export const contestApi = {
  getContests: async (): Promise<any[]> => {
    const response = await api.get('/contests');
    return response.data;
  },
  getContest: async (id: string): Promise<any> => {
    const response = await api.get(`/contests/${id}`);
    return response.data;
  },
  joinContest: async (id: string): Promise<any> => {
    const response = await api.post(`/contests/${id}/join`);
    return response.data;
  },
};

// Friends/Social APIs
export const friendsApi = {
  getFriends: async (): Promise<any> => {
    const response = await api.get('/social/friends', { silentFail: true } as any);
    return response.data;
  },
  getSuggestions: async (): Promise<any[]> => {
    const response = await api.get('/social/suggestions', { silentFail: true } as any);
    return response.data;
  },
  sendRequest: async (targetUserId: string): Promise<any> => {
    const response = await api.post('/social/friends/request', { targetUserId });
    return response.data;
  },
  acceptRequest: async (requesterId: string): Promise<any> => {
    const response = await api.post('/social/friends/accept', { requesterId });
    return response.data;
  },
  declineRequest: async (requesterId: string): Promise<any> => {
    const response = await api.post('/social/friends/decline', { requesterId });
    return response.data;
  },
  removeFriend: async (friendId: string): Promise<any> => {
    const response = await api.delete('/social/friends/remove', { data: { friendId } });
    return response.data;
  },
};

// Chat APIs
export const chatApi = {
  getRooms: async (): Promise<any> => {
    const response = await api.get('/chat-api/rooms', { silentFail: true } as any);
    return response.data;
  },
  getMessages: async (roomId: string): Promise<any[]> => {
    const response = await api.get(`/chat-api/messages/${encodeURIComponent(roomId)}`, { silentFail: true } as any);
    return response.data;
  },
  sendMessage: async (data: { room: string; content: string; replyTo?: string }): Promise<any> => {
    const response = await api.post('/chat-api/messages', data);
    return response.data;
  },
  addReaction: async (messageId: string, emoji: string): Promise<any> => {
    const response = await api.post(`/chat-api/messages/${messageId}/react`, { emoji });
    return response.data;
  },
};

// Community APIs
export const communityApi = {
  getPosts: async (params?: { type?: string; search?: string; sort?: string; page?: number }): Promise<any> => {
    const response = await api.get('/community', { params, silentFail: true } as any);
    return response.data;
  },
  getPost: async (id: string): Promise<any> => {
    const response = await api.get(`/community/${id}`, { silentFail: true } as any);
    return response.data;
  },
  createPost: async (data: { title: string; content: string; type: string; tags: string[]; code?: string; language?: string }): Promise<any> => {
    const response = await api.post('/community', data);
    return response.data;
  },
  upvotePost: async (id: string): Promise<any> => {
    const response = await api.post(`/community/${id}/upvote`);
    return response.data;
  },
  addReply: async (id: string, content: string): Promise<any> => {
    const response = await api.post(`/community/${id}/reply`, { content });
    return response.data;
  },
  deletePost: async (id: string): Promise<any> => {
    const response = await api.delete(`/community/${id}`);
    return response.data;
  },
  getStats: async (): Promise<any> => {
    const response = await api.get('/community/stats', { silentFail: true } as any);
    return response.data;
  },
};
