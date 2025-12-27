import express from "express";
import {
  getPythonTopics,
  getPythonTopic,
  completePythonTopic,
  passPythonTest,
  useHint,
} from "../controllers/pythonController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/topics", protect, getPythonTopics);
router.get("/topics/:slug", protect, getPythonTopic);
router.post("/topics/complete", protect, completePythonTopic);
router.post("/topics/pass-test", protect, passPythonTest);
router.post("/hint/use", protect, useHint);

export default router;


