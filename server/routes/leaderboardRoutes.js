import express from "express";
import { getLeaderboard, getUserRank } from "../controllers/leaderboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Top 10 leaderboard
router.get("/", getLeaderboard);

// Your rank
router.get("/me", protect, getUserRank);

export default router;
