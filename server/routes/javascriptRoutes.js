import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getJavascriptTopics,
  getJavascriptTopic,
  completeJavascriptTopic,
} from "../controllers/javascriptController.js";

const router = express.Router();

router.get("/topics", protect, getJavascriptTopics);
router.get("/topics/:slug", protect, getJavascriptTopic);
router.post("/topics/complete", protect, completeJavascriptTopic);

export default router;
