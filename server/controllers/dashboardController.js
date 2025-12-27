import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";

export const getUserDashboard = async (req, res) => {
  try {
    // 1️⃣ Get or create progress
    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        points: 0,
        level: 1,
        badges: [],
        completedTests: [],
        notifications: []
      });
    }

    // 2️⃣ Get all tests
    const tests = await CodingTest.find({});

    // 3️⃣ Build dashboard tests
    const dashboardTests = tests.map((test, index) => {
      const completed = progress.completedTests.includes(test._id);

      const unlocked =
        completed ||
        progress.level >= test.unlockLevel ||
        index === 0;

      const hints = test.hints.slice(0, progress.level);

      return {
        _id: test._id,
        title: test.title,
        description: test.description,
        difficulty: test.difficulty,
        unlocked,
        completed,
        hints
      };
    });

    // 4️⃣ Send dashboard
    res.status(200).json({
      points: progress.points,
      level: progress.level,
      badges: progress.badges,
      notifications: progress.notifications,
      tests: dashboardTests
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
