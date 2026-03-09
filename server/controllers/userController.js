import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("solvedTests");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      level: user.level,
      badges: user.badges,
      streak: user.streak,
      rank: user.rank,
      accuracy: user.accuracy,
      languageStats: user.languageStats,
      bio: user.bio,
      country: user.country,
      github: user.github,
      linkedin: user.linkedin,
      avatar: user.avatar,
      createdAt: user.createdAt,
      contestRating: user.contestRating,
      solvedTestsCount: user.solvedTests.length,
      solvedTests: user.solvedTests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, bio, country, github, linkedin, avatar } = req.body;
    
    // Validate inputs if needed
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (country !== undefined) user.country = country;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
