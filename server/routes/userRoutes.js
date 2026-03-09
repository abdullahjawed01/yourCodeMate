import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboard, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.status(200).json({ message: "User verified", user: req.user });
});
router.put("/me/profile", protect, updateProfile);
router.get("/users/:userId/dashboard", getDashboard);





export default router;


