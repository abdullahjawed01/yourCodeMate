import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  difficulty: { type: String, enum: ["easy","medium","hard"], default: "easy" },
  testCases: [{ input: String, expectedOutput: String }],
  maxScore: { type: Number, default: 10 },
  unlockLevel: { type: Number, default: 1 },  // 🔹 Level required to unlock
  hints: [String]
}, { timestamps: true });

export default mongoose.model("Test", testSchema);
