import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getLanguageTopics, getTopicDetails, completeTopic } from "../controllers/languageController.js";

const router = express.Router();

router.get("/:language/topics", protect, getLanguageTopics);
router.get("/:language/topics/:slug", protect, getTopicDetails);
router.post("/:language/topics/:topicId/complete", protect, completeTopic);

export default router;
