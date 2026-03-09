import User from "../models/User.js";

// Get top 50 users by points (global leaderboard)
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ points: -1 })
      .limit(50)
      .select('name email points level streak badges createdAt');

    // Add rank number to each entry
    const leaderboard = topUsers.map((u, i) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      points: u.points || 0,
      level: u.level || 1,
      streak: u.streak || 0,
      badges: u.badges || [],
      rank: i + 1,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's rank
export const getUserRank = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).select('name points level streak badges');

    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count users with more points
    const higherCount = await User.countDocuments({ points: { $gt: me.points || 0 } });
    const rank = higherCount + 1;

    res.status(200).json({
      rank,
      user: {
        _id: me._id,
        name: me.name,
        points: me.points || 0,
        level: me.level || 1,
        streak: me.streak || 0,
        badges: me.badges || [],
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

