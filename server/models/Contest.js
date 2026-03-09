import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "CodingTest" }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  leaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    score: { type: Number, default: 0 },
    finishTime: { type: Date },
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });

const Contest = mongoose.model("Contest", contestSchema);
export default Contest;
