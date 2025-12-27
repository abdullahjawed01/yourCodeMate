import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";

export const updateUserProgress = async (req, res) => {
  try {
    const { user } = req;
    const { pointsEarned, badge, testId } = req.body;

    if (!pointsEarned && !badge && !testId) {
      return res.status(400).json({ message: "No updates provided" });
    }

    let progress = await Progress.findOne({ user: user._id });
    if (!progress) {
      progress = await Progress.create({
        user: user._id,
        points: 0,
        level: 1,
        badges: [],
        completedTests: [],
        notifications: []
      });
    }

    if (pointsEarned) progress.points += pointsEarned;
    progress.level = Math.floor(progress.points / 100) + 1;

    let isBadgeEarned = false;
    if (badge && !progress.badges.includes(badge)) {
      progress.badges.push(badge);
      isBadgeEarned = true;
    }

    let isTestCompleted = false;
    let testTitle = testId;
    if (testId && !progress.completedTests.includes(testId)) {
      progress.completedTests.push(testId);
      isTestCompleted = true;

      const test = await CodingTest.findById(testId);
      if (test) testTitle = test.title;
    }

    // Notifications
    if (isBadgeEarned) progress.notifications.push({ message: `Congratulations! You earned a new badge: ${badge}` });
    if (isTestCompleted) progress.notifications.push({ message: `You completed a test: ${testTitle}` });

    await progress.save();

    res.status(200).json({ message: "User progress updated", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
