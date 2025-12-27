import Progress from "../models/Progress.js";
import User from "../models/User.js";

// Get top users
export const getLeaderboard = async (req, res) => {
  try {
    // Top 10 users by points
    const topUsers = await Progress.find({})
      .sort({ points: -1 })
      .limit(10)
      .populate("user", "name email"); // Show name & email only

    res.status(200).json({ leaderboard: topUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get your rank
export const getUserRank = async (req, res) => {
  try {
    const userProgress = await Progress.findOne({ user: req.user._id });

    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    // Count users with more points
    const higherUsers = await Progress.countDocuments({ points: { $gt: userProgress.points } });

    const rank = higherUsers + 1; // Rank starts at 1

    res.status(200).json({
      user: req.user.name,
      points: userProgress.points,
      level: userProgress.level,
      rank
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
