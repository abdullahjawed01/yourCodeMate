import mongoose from "mongoose";

const codingTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["easy","medium","hard"], default: "easy" },
  testCases: [{ input: String, expectedOutput: String }],
  maxScore: { type: Number, default: 100 },
  unlockLevel: { type: Number, default: 1 },
  hintCost: { type: Number, default: 10 },
  hints: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  estimatedTime: { type: Number, default: 30 }, // minutes
}, { timestamps: true });

const CodingTest = mongoose.model("CodingTest", codingTestSchema);
export default CodingTest;

