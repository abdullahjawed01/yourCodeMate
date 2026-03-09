import LanguageTopic from "../models/LanguageTopic.js";
import LearningProgress from "../models/LearningProgress.js";
import User from "../models/User.js";

export const getLanguageTopics = async (req, res) => {
  try {
    const { language } = req.params;
    const userId = req.user._id;

    const topics = await LanguageTopic.find({ language }).sort({ order: 1 });
    let progress = await LearningProgress.findOne({ user: userId });

    if (!progress) {
      progress = await LearningProgress.create({ user: userId });
    }

    let langProgress = progress.languageProgress.find(lp => lp.language === language);
    if (!langProgress) {
      langProgress = { language, topics: [], currentTopic: topics[0]?._id };
      progress.languageProgress.push(langProgress);
      await progress.save();
    }

    // Merge topics with user progress
    const mergedTopics = topics.map((t, index) => {
      const userTopic = langProgress.topics.find((ut) => ut.topicId.toString() === t._id.toString());
      
      let unlocked = index === 0; // First always unlocked
      if (userTopic?.completed) unlocked = true;
      if (index > 0 && !unlocked && langProgress.topics.find(ut => ut.topicId.toString() === topics[index - 1]._id.toString())?.completed) {
          unlocked = true;
      }

      return {
        ...t._doc,
        completed: userTopic?.completed || false,
        isCurrent: langProgress.currentTopic?.toString() === t._id.toString(),
        unlocked
      };
    });

    res.json({ topics: mergedTopics, progress: { totalPoints: progress.totalPoints } });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTopicDetails = async (req, res) => {
  try {
    const { language, slug } = req.params;
    const topic = await LanguageTopic.findOne({ language, slug });
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const completeTopic = async (req, res) => {
  try {
    const { language, topicId } = req.params;
    const userId = req.user._id;

    let progress = await LearningProgress.findOne({ user: userId });
    if (!progress) return res.status(404).json({ message: "Progress not found" });

    const topic = await LanguageTopic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    let langProgress = progress.languageProgress.find(lp => lp.language === language);
    if (!langProgress) return res.status(400).json({ message: "Language track not started" });

    const existingTopic = langProgress.topics.find((t) => t.topicId.toString() === topicId);
    if (existingTopic?.completed) {
      return res.status(400).json({ message: "Topic already completed" });
    }

    if (existingTopic) {
      existingTopic.completed = true;
      existingTopic.pointsEarned = topic.pointsReward;
    } else {
      langProgress.topics.push({
        topicId: topic._id,
        completed: true,
        pointsEarned: topic.pointsReward,
      });
    }

    // Assign next topic
    const allTopics = await LanguageTopic.find({ language }).sort({ order: 1 });
    const currentIndex = allTopics.findIndex((t) => t._id.toString() === topicId);
    if (currentIndex < allTopics.length - 1) {
      langProgress.currentTopic = allTopics[currentIndex + 1]._id;
    }

    progress.totalPoints += topic.pointsReward;
    await progress.save();

    const user = await User.findById(userId);
    user.points += topic.pointsReward;
    
    // Simple level up logic
    const newLevel = Math.floor(user.points / 100) + 1;
    user.level = newLevel;
    
    await user.save();

    res.json({ message: "Topic completed successfully", points: topic.pointsReward, level: user.level });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
