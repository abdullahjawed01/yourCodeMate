import express from "express";
import { getProgress, updateProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Private routes
router.get("/me", protect, getProgress);
router.post("/progress", protect, updateProgress);

export default router;
