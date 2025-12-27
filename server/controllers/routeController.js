import express from "express";

/**
 * Get all available routes in the application
 */
export const getAllRoutes = async (req, res) => {
  try {
    const routes = [
      // Auth Routes
      { method: "POST", path: "/auth/register", description: "Register a new user", auth: false },
      { method: "POST", path: "/auth/login", description: "Login user", auth: false },
      
      // User Routes
      { method: "GET", path: "/me", description: "Get current user", auth: true },
      { method: "GET", path: "/users/:userId/dashboard", description: "Get user dashboard", auth: true },
      
      // Test Routes
      { method: "GET", path: "/test", description: "Get all tests (public)", auth: false },
      { method: "GET", path: "/test/:id", description: "Get test by ID", auth: false },
      { method: "GET", path: "/test/dashboard", description: "Get user tests with progress", auth: true },
      
      // Coding Test Routes
      { method: "GET", path: "/tests", description: "Get all tests (protected)", auth: true },
      { method: "POST", path: "/tests/submit", description: "Submit test solution", auth: true },
      { method: "POST", path: "/tests/create", description: "Create new test", auth: false },
      
      // IDE Routes
      { method: "POST", path: "/ide/run", description: "Run code in IDE", auth: true },
      
      // AI Routes
      { method: "POST", path: "/ai/submit", description: "Evaluate code with AI", auth: true },
      { method: "POST", path: "/ai/explain", description: "Explain code with AI", auth: true },
      
      // AI Mentor Routes
      { method: "POST", path: "/mentor/ask", description: "Ask AI mentor", auth: true },
      
      // Dashboard Routes
      { method: "GET", path: "/dashboard", description: "Get user dashboard data", auth: true },
      
      // Progress Routes
      { method: "GET", path: "/progress/me", description: "Get user progress", auth: true },
      { method: "POST", path: "/progress/progress", description: "Update user progress", auth: true },
      
      // Leaderboard Routes
      { method: "GET", path: "/leaderboard", description: "Get leaderboard", auth: false },
      { method: "GET", path: "/leaderboard/me", description: "Get user rank", auth: true },
      
      // Learning Path Routes
      { method: "GET", path: "/paths", description: "Get all learning paths", auth: false },
      { method: "POST", path: "/paths/create", description: "Create learning path", auth: false },
      
      // Path Routes
      { method: "GET", path: "/path/tests", description: "Get available tests for path", auth: true },
      
      // Interview Routes
      { method: "POST", path: "/interview/start", description: "Start interview session", auth: true },
      { method: "POST", path: "/interview/answer", description: "Submit interview answer", auth: true },
      
      // Hint Routes
      { method: "POST", path: "/hint", description: "Get hint for test", auth: true },
      
      // Recommendation Routes
      { method: "GET", path: "/recommend/:userId", description: "Get recommended test", auth: false },
      
      // Gamification Routes
      { method: "POST", path: "/gamification/update", description: "Update gamification progress", auth: true },
      
      // Admin Routes
      { method: "POST", path: "/admin/test", description: "Create test (admin)", auth: true, admin: true },
      { method: "PUT", path: "/admin/test/:id", description: "Update test (admin)", auth: true, admin: true },
      { method: "DELETE", path: "/admin/test/:id", description: "Delete test (admin)", auth: true, admin: true },
    ];

    res.status(200).json({
      total: routes.length,
      routes: routes,
      baseUrl: process.env.API_URL || "http://localhost:5000"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


