import express from "express";
import { getAllTests, submitSolution,createTest } from "../controllers/codingTestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Private routes
router.get("/tests", protect, getAllTests);
router.post("/tests/submit", protect, submitSolution);
router.post("/tests/create", createTest);

export default router;
