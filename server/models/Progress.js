import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [String],
  completedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: "CodingTest" }],
  notifications: [{ message: String, createdAt: { type: Date, default: Date.now } }],
  flags: { type: Number, default: 0 }
});


export default mongoose.models.Progress || mongoose.model("Progress", progressSchema);
