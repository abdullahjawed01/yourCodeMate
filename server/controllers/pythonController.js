import PythonTopic from "../models/PythonTopic.js";
import LearningProgress from "../models/LearningProgress.js";
import CodingTest from "../models/CodingTest.js";
import Progress from "../models/Progress.js";

// Get all Python topics with user progress
export const getPythonTopics = async (req, res) => {
  try {
    const userId = req.user?._id;
    const topics = await PythonTopic.find({}).sort({ order: 1 }).lean();
    
    let userProgress = null;
    if (userId) {
      userProgress = await LearningProgress.findOne({ user: userId });
      
      if (!userProgress) {
        userProgress = await LearningProgress.create({
          user: userId,
          pythonTopics: [],
          totalPoints: 0,
        });
      }
    }

    const topicsWithProgress = topics.map((topic) => {
      const progress = userProgress?.pythonTopics.find(
        (p) => p.topicId.toString() === topic._id.toString()
      );
      
      // Check if prerequisites are met
      const prerequisitesMet = !topic.prerequisites || topic.prerequisites.length === 0 ||
        topic.prerequisites.every((prereq) => {
          const prereqTopic = topics.find((t) => t.slug === prereq);
          if (!prereqTopic) return true;
          const prereqProgress = userProgress?.pythonTopics.find(
            (p) => p.topicId.toString() === prereqTopic._id.toString()
          );
          return prereqProgress?.completed && prereqProgress?.testPassed;
        });

      return {
        ...topic,
        completed: progress?.completed || false,
        testPassed: progress?.testPassed || false,
        pointsEarned: progress?.pointsEarned || 0,
        unlocked: prerequisitesMet,
        isCurrent: userProgress?.currentTopic?.toString() === topic._id.toString(),
      };
    });

    res.status(200).json({
      topics: topicsWithProgress,
      progress: {
        totalPoints: userProgress?.totalPoints || 0,
        hintsUnlocked: userProgress?.hintsUnlocked || 0,
        hintsUsed: userProgress?.hintsUsed || 0,
        currentTopic: userProgress?.currentTopic,
      },
    });
  } catch (error) {
    console.error("getPythonTopics error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single Python topic with content
export const getPythonTopic = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?._id;

    const topic = await PythonTopic.findOne({ slug }).populate('testId');
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    let userProgress = null;
    if (userId) {
      userProgress = await LearningProgress.findOne({ user: userId });
      const topicProgress = userProgress?.pythonTopics.find(
        (p) => p.topicId.toString() === topic._id.toString()
      );

      return res.status(200).json({
        topic: {
          ...topic.toObject(),
          completed: topicProgress?.completed || false,
          testPassed: topicProgress?.testPassed || false,
          pointsEarned: topicProgress?.pointsEarned || 0,
        },
      });
    }

    res.status(200).json({ topic });
  } catch (error) {
    console.error("getPythonTopic error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark topic as completed and award points
export const completePythonTopic = async (req, res) => {
  try {
    const { topicId } = req.body;
    const userId = req.user._id;

    const topic = await PythonTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    let learningProgress = await LearningProgress.findOne({ user: userId });
    if (!learningProgress) {
      learningProgress = await LearningProgress.create({
        user: userId,
        pythonTopics: [],
        totalPoints: 0,
      });
    }

    const existingProgress = learningProgress.pythonTopics.find(
      (p) => p.topicId.toString() === topicId
    );

    if (existingProgress && existingProgress.completed) {
      return res.status(400).json({ message: "Topic already completed" });
    }

    // Award points
    const pointsEarned = topic.pointsReward;
    learningProgress.totalPoints += pointsEarned;

    if (existingProgress) {
      existingProgress.completed = true;
      existingProgress.completedAt = new Date();
      // Only add points if not previously earned or re-earning enabled (usually not)
      // existingProgress.pointsEarned += pointsEarned; // Assuming one-time reward
    } else {
      learningProgress.pythonTopics.push({
        topicId,
        completed: true,
        completedAt: new Date(),
        pointsEarned,
      });
    }

    // Update user progress (Global)
    let userProgress = await Progress.findOne({ user: userId });
    if (!userProgress) {
      userProgress = await Progress.create({
        user: userId,
        points: 0,
        level: 1,
        badges: [],
        completedTests: [],
        notifications: [],
      });
    }

    // Update global points
    userProgress.points += pointsEarned;
    userProgress.level = Math.floor(userProgress.points / 100) + 1;
    userProgress.notifications.push({
      message: `🎉 Completed "${topic.title}" and earned ${pointsEarned} points!`,
    });

    // Save both
    await Promise.all([learningProgress.save(), userProgress.save()]);

    res.status(200).json({
      message: "Topic completed successfully",
      pointsEarned,
      totalPoints: learningProgress.totalPoints,
    });
  } catch (error) {
    console.error("completePythonTopic error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Pass test to unlock next topic
export const passPythonTest = async (req, res) => {
  try {
    const { topicId, testId, score } = req.body;
    const userId = req.user._id;

    const topic = await PythonTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (topic.testId.toString() !== testId) {
      return res.status(400).json({ message: "Invalid test for this topic" });
    }

    let learningProgress = await LearningProgress.findOne({ user: userId });
    if (!learningProgress) {
      learningProgress = await LearningProgress.create({
        user: userId,
        pythonTopics: [],
        totalPoints: 0,
      });
    }

    const topicProgress = learningProgress.pythonTopics.find(
      (p) => p.topicId.toString() === topicId
    );

    if (topicProgress) {
      topicProgress.testPassed = true;
      topicProgress.testScore = score;
    } else {
      learningProgress.pythonTopics.push({
        topicId,
        testPassed: true,
        testScore: score,
      });
    }

    // Set next topic as current
    const nextTopic = await PythonTopic.findOne({ order: topic.order + 1 });
    if (nextTopic) {
      learningProgress.currentTopic = nextTopic._id;
    }

    await learningProgress.save();

    res.status(200).json({
      message: "Test passed! Next topic unlocked.",
      nextTopic: nextTopic ? {
        _id: nextTopic._id,
        title: nextTopic.title,
        slug: nextTopic.slug,
      } : null,
    });
  } catch (error) {
    console.error("passPythonTest error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Use hint (deduct points)
export const useHint = async (req, res) => {
  try {
    const { testId } = req.body;
    const userId = req.user._id;

    const test = await CodingTest.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let learningProgress = await LearningProgress.findOne({ user: userId });
    if (!learningProgress) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    if (learningProgress.totalPoints < test.hintCost) {
      return res.status(400).json({ 
        message: `You need ${test.hintCost} points to unlock this hint. You have ${learningProgress.totalPoints} points.`,
      });
    }

    learningProgress.totalPoints -= test.hintCost;
    learningProgress.hintsUsed += 1;
    learningProgress.hintsUnlocked += 1;

    await learningProgress.save();

    res.status(200).json({
      message: "Hint unlocked",
      remainingPoints: learningProgress.totalPoints,
      hintCost: test.hintCost,
    });
  } catch (error) {
    console.error("useHint error:", error);
    res.status(500).json({ message: error.message });
  }
};


