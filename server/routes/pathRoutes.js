import express from "express";
import { getAvailableTests } from "../controllers/pathController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all tests (locked/unlocked based on level)
router.get("/tests", protect, getAvailableTests);

export default router;
