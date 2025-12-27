import express from "express";
import { recommendNextTest } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/recommend/:userId", recommendNextTest);

export default router;
