import mongoose from "mongoose";
import Progress from "../models/Progress.js";

// CodingTest schema pointing to your existing DB collection
const codingTestSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  testCases: [{ input: String, expectedOutput: String }],
  maxScore: { type: Number, default: 100 },
  unlockLevel: { type: Number, default: 1 },
  hints: [String]
}, { collection: "codingtest" }); // make sure this matches your DB

// 🔹 Prevent OverwriteModelError
const CodingTest = mongoose.models.CodingTest || mongoose.model("CodingTest", codingTestSchema);

// GET all tests
export const getAllTests = async (req, res) => {
  try {
    const tests = await CodingTest.find({});
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET tests for dashboard
export const getUserTests = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });

    let userProgress = await Progress.findOne({ user: req.user._id });

    if (!userProgress) {
      userProgress = await Progress.create({
        user: req.user._id,
        points: 0,
        level: 1,
        badges: [],
        completedTests: []
      });
    }

    const userLevel = userProgress.level;
    const tests = await CodingTest.find({}).lean();

    const testsWithStatus = tests.map(test => ({
      ...test,
      unlocked: userLevel >= test.unlockLevel
    }));

    res.status(200).json({ tests: testsWithStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
