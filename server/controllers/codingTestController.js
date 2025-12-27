import CodingTest from "../models/CodingTest.js";
import User from "../models/User.js";

export const getAllTests = async (req, res) => {
  const { user } = req;
  const tests = await CodingTest.find({ unlockLevel: { $lte: user.level } });
  res.status(200).json(tests);
};


export const submitSolution = async (req, res) => {
  try {
    const { userId, testId } = req.body;

    const user = await User.findById(userId);
    const test = await CodingTest.findById(testId);

    if (!user || !test)
      return res.status(404).json({ message: "User or Test not found" });

    //  Check level unlock
    if (user.level < test.unlockLevel) {
      return res.status(403).json({
        message: "Test locked. Increase your level.",
      });
    }

   
    if (user.solvedTests.includes(testId)) {
      return res.status(400).json({
        message: "Test already solved",
      });
    }

    // EASY scoring
    const score = 10;
    user.points += score;
    user.level = Math.floor(user.points / 10) + 1;

    user.solvedTests.push(testId);

    if (!user.badges.includes("First Test Solved")) {
      user.badges.push("First Test Solved");
    }

    await user.save();

    res.status(200).json({
      message: "Test submitted successfully",
      score,
      user,
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
