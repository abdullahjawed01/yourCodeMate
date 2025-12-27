import Progress from "../models/Progress.js";
import Test from "../models/Test.js";  // ✅ Add this line here

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id })
      .populate("completedTests", "title difficulty"); // uses Test

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE user's progress
export const updateProgress = async (req, res) => {
  try {
    const { lessonsCompleted, exercisesCompleted, codeSnippets } = req.body;

    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        lessonsCompleted,
        exercisesCompleted,
        codeSnippets
      });
    } else {
      if (lessonsCompleted) progress.lessonsCompleted.push(...lessonsCompleted);
      if (exercisesCompleted) progress.exercisesCompleted.push(...exercisesCompleted);
      if (codeSnippets) progress.codeSnippets.push(...codeSnippets);
      await progress.save();
    }

    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
