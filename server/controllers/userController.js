import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("solvedTests");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      points: user.points,
      level: user.level,
      badges: user.badges,
      solvedTestsCount: user.solvedTests.length,
      solvedTests: user.solvedTests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
