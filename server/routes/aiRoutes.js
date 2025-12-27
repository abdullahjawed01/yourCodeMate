import express from "express";
import { evaluateCode, explainCode } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Submit code -> AI scoring + gamification
router.post("/submit", protect, evaluateCode);

// 🔹 Explain code -> AI explanation
router.post("/explain", protect, explainCode);

export default router;
