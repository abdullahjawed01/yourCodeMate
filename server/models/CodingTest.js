import mongoose from "mongoose";

const codingTestSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: { type: String, enum: ["easy","medium","hard"], default: "easy" },
  testCases: [{ input: String, expectedOutput: String }],
  maxScore: { type: Number, default: 100 },
  unlockLevel: { type: Number, default: 1 },
  hintCost: { type: Number, default: 10 }
}, { timestamps: true });

const CodingTest = mongoose.model("CodingTest", codingTestSchema);
export default CodingTest;

