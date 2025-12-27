
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: String, // frontend, backend, python, etc
  level: { type: String, enum: ["junior", "mid", "senior"] },
  questions: [
    {
      question: String,
      answer: String,
      feedback: String,
      score: Number
    }
  ],
  totalScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("InterviewSession", interviewSchema);
