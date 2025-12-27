import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHint } from "../controllers/hintController.js";

const router = express.Router();

// Route: POST /hint
// Purpose: Get AI-generated hint for a coding test (deduct points)
router.post("/", protect, getHint);

export default router;