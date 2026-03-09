import mongoose from "mongoose";

const codingBattleSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  opponent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mode: { type: String, enum: ['speed', 'accuracy', 'timed'], required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "CodingTest", required: true },
  status: { type: String, enum: ['lobby', 'active', 'finished'], default: 'lobby' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: { type: Date },
  endTime: { type: Date },
  creatorProgress: { type: Number, default: 0 },
  opponentProgress: { type: Number, default: 0 },
}, { timestamps: true });

const CodingBattle = mongoose.model("CodingBattle", codingBattleSchema);
export default CodingBattle;
