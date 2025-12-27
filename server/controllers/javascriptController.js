import JavascriptTopic from "../models/JavascriptTopic.js";
import LearningProgress from "../models/LearningProgress.js";
import Progress from "../models/Progress.js";

// Get all JavaScript topics with user progress
export const getJavascriptTopics = async (req, res) => {
  try {
    const userId = req.user?._id;
    const topics = await JavascriptTopic.find({}).sort({ order: 1 }).lean();
    
    let userProgress = null;
    if (userId) {
      userProgress = await LearningProgress.findOne({ user: userId });
      
      if (!userProgress) {
        userProgress = await LearningProgress.create({
          user: userId,
          javascriptTopics: [], // Using specific field for JS? Or shared structure?
          // Note: LearningProgress model might need an update to support javascriptTopics explicitly if not dynamic
          // Assuming we update LearningProgress schema or it is flexible.
          // IF the schema is strict, we need to add javascriptTopics to it.
          // For now let's assume we add it to the model.
          totalPoints: 0,
        });
      }
    }

    const topicsWithProgress = topics.map((topic) => {
      // Safely access javascriptTopics if it exists, otherwise empty
      const jsProgressList = userProgress?.javascriptTopics || [];
      const progress = jsProgressList.find(
        (p) => p.topicId.toString() === topic._id.toString()
      );
      
      // Check if prerequisites are met
      const prerequisitesMet = !topic.prerequisites || topic.prerequisites.length === 0 ||
        topic.prerequisites.every((prereq) => {
          const prereqTopic = topics.find((t) => t.slug === prereq);
          if (!prereqTopic) return true;
          const prereqProgress = jsProgressList.find(
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
        isCurrent: userProgress?.currentJsTopic?.toString() === topic._id.toString(),
      };
    });

    res.status(200).json({
      topics: topicsWithProgress,
      progress: {
        totalPoints: userProgress?.totalPoints || 0,
        hintsUnlocked: userProgress?.hintsUnlocked || 0,
        hintsUsed: userProgress?.hintsUsed || 0,
      },
    });
  } catch (error) {
    console.error("getJavascriptTopics error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single JavaScript topic with content
export const getJavascriptTopic = async (req, res) => {
  try {
    const { slug } = req.params;
    const topic = await JavascriptTopic.findOne({ slug }).populate('testId');
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ topic });
  } catch (error) {
    console.error("getJavascriptTopic error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark topic as completed
export const completeJavascriptTopic = async (req, res) => {
  try {
    const { topicId } = req.body;
    const userId = req.user._id;

    const topic = await JavascriptTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    let learningProgress = await LearningProgress.findOne({ user: userId });
    if (!learningProgress) {
       learningProgress = await LearningProgress.create({ user: userId });
    }

    // Ensure javascriptTopics array exists
    if (!learningProgress.javascriptTopics) {
        learningProgress.javascriptTopics = [];
    }

    const existingProgress = learningProgress.javascriptTopics.find(
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
    } else {
      learningProgress.javascriptTopics.push({
        topicId,
        completed: true,
        completedAt: new Date(),
        pointsEarned,
      });
    }

    // Update user progress (Global)
    let userProgress = await Progress.findOne({ user: userId });
    if (!userProgress) {
        userProgress = await Progress.create({ user: userId });
    }

    userProgress.points += pointsEarned;
    userProgress.level = Math.floor(userProgress.points / 100) + 1;
    userProgress.notifications.push({
      message: `🎉 Completed "${topic.title}" in JS Path and earned ${pointsEarned} points!`,
    });

    await Promise.all([learningProgress.save(), userProgress.save()]);

    res.status(200).json({
      message: "Topic completed successfully",
      pointsEarned,
      totalPoints: learningProgress.totalPoints,
    });
  } catch (error) {
    console.error("completeJavascriptTopic error:", error);
    res.status(500).json({ message: error.message });
  }
};
