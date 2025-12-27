import CodingTest from "../models/CodingTest.js";
import User from "../models/User.js";

export const getAllTests = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tests = await CodingTest.find({ unlockLevel: { $lte: user.level } })
      .sort({ unlockLevel: 1, difficulty: 1, createdAt: -1 })
      .lean();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const submitSolution = async (req, res) => {
  try {
    const { testId, code, language } = req.body;
    const userId = req.user._id;

    if (!testId || !code) {
      return res.status(400).json({ message: "testId and code are required" });
    }

    const user = await User.findById(userId);
    const test = await CodingTest.findById(testId);

    if (!user || !test) {
      return res.status(404).json({ message: "User or Test not found" });
    }

    // Check level unlock
    if (user.level < test.unlockLevel) {
      return res.status(403).json({
        message: "Test locked. Increase your level.",
      });
    }

    // Check if already solved
    const testIdStr = testId.toString();
    if (user.solvedTests.some(id => id.toString() === testIdStr)) {
      return res.status(400).json({
        message: "Test already solved",
      });
    }

    // Basic scoring (AI evaluation should be done via /ai/submit)
    const score = 10;
    user.points += score;
    user.level = Math.floor(user.points / 100) + 1;

    user.solvedTests.push(testId);

    if (!user.badges.includes("First Test Solved")) {
      user.badges.push("First Test Solved");
    }

    await user.save();

    res.status(200).json({
      message: "Test submitted successfully",
      score,
      user: {
        _id: user._id,
        name: user.name,
        points: user.points,
        level: user.level,
        badges: user.badges
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new coding test
export const createTest = async (req, res) => {
  try {
    const { title, description, difficulty, testCases, maxScore, unlockLevel, hints } = req.body;

    if (!title || !description || !testCases) {
      return res.status(400).json({ message: "Title, description, and testCases are required" });
    }

    const newTest = await CodingTest.create({
      title,
      description,
      difficulty: difficulty || "easy",
      testCases,
      maxScore: maxScore || 100,
      unlockLevel: unlockLevel || 1,
      hints: hints || [],
    });

    res.status(201).json({ message: "Test created successfully", test: newTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
