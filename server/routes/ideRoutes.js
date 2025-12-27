import express from "express";
import { runCode } from "../controllers/ideController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Private route
router.post("/ide/run", protect, runCode);

export default router;

