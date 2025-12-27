import CodingTest from "../models/CodingTest.js";
import Progress from "../models/Progress.js";

// GET all tests (public)
export const getAllTests = async (req, res) => {
  try {
    const tests = await CodingTest.find({}).sort({ unlockLevel: 1, createdAt: -1 }).lean();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single test by ID
export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await CodingTest.findById(id);
    
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET tests for dashboard (with user progress)
export const getUserTests = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let userProgress = await Progress.findOne({ user: req.user._id });

    if (!userProgress) {
      userProgress = await Progress.create({
        user: req.user._id,
        points: 0,
        level: 1,
        badges: [],
        completedTests: [],
        notifications: []
      });
    }

    const userLevel = userProgress.level;
    const completedTestIds = userProgress.completedTests.map(id => id.toString());
    const tests = await CodingTest.find({}).sort({ unlockLevel: 1, createdAt: -1 }).lean();

    const testsWithStatus = tests.map(test => {
      const testIdStr = test._id.toString();
      const unlocked = userLevel >= test.unlockLevel || completedTestIds.includes(testIdStr);
      const completed = completedTestIds.includes(testIdStr);
      
      return {
        ...test,
        unlocked,
        completed
      };
    });

    res.status(200).json(testsWithStatus);
  } catch (error) {
    console.error("getUserTests error:", error);
    res.status(500).json({ message: error.message });
  }
};
