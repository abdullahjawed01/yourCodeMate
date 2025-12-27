import express from "express";
import { getAllTests, getUserTests, getTestById } from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route – all coding tests
router.get("/", getAllTests);

// Dashboard route – locked/unlocked with user progress
router.get("/dashboard", protect, getUserTests);

// Get single test by ID
router.get("/:id", getTestById);

export default router;
