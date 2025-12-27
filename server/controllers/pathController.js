import Test from "../models/Test.js";
import Progress from "../models/Progress.js";

// Get all tests and mark locked/unlocked
export const getAvailableTests = async (req, res) => {
  try {
    const userProgress = await Progress.findOne({ user: req.user._id });
    const userLevel = userProgress ? userProgress.level : 1;

    const tests = await Test.find({}).lean();

    const testsWithStatus = tests.map(test => ({
      ...test,
      unlocked: userLevel >= test.unlockLevel
    }));

    res.status(200).json({ tests: testsWithStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
