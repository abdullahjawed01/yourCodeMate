import express from "express";
import { createTest, updateTest, deleteTest } from "../controllers/adminTestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only routes
router.post("/", protect, adminOnly, createTest);
router.put("/:id", protect, adminOnly, updateTest);
router.delete("/:id", protect, adminOnly, deleteTest);

export default router;
