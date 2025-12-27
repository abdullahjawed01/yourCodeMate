import express from "express";
import {
  createPath,
  getAllPaths,
} from "../controllers/learningPathController.js";

const router = express.Router();

router.post("/paths/create", createPath);
router.get("/paths", getAllPaths);

export default router;
