import express from "express";
import { getAllTests, getUserTests } from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin / submission route – all coding tests
router.get("/", getAllTests);

// Dashboard route – locked/unlocked
router.get("/dashboard", protect, getUserTests);

export default router;
