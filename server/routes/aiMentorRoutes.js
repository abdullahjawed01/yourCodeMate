import express from "express";
import { askMentor } from "../controllers/aiMentorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Private route
router.post("/mentor/ask", protect, askMentor);

export default router;
