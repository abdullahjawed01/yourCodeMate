import express from "express";
import { updateUserProgress } from "../controllers/gamificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Update user progress manually (points, badges, test)
router.post("/update", protect, updateUserProgress);

export default router;
