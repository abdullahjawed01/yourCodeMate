import mongoose from "mongoose";

const learningPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Python Beginner
    description: String,
    level: { type: Number, default: 1 },
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodingTest",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("LearningPath", learningPathSchema);
