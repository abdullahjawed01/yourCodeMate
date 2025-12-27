import express from "express";
import { getAllRoutes } from "../controllers/routeController.js";

const router = express.Router();

// Get all routes (public endpoint for documentation)
router.get("/", getAllRoutes);

export default router;


