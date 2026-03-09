import mongoose from "mongoose";

const learningProgressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
    unique: true
  },
  languageProgress: [{
    language: { type: String, required: true },
    topics: [{
      topicId: { type: mongoose.Schema.Types.ObjectId, ref: "LanguageTopic" },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      pointsEarned: { type: Number, default: 0 },
      testPassed: { type: Boolean, default: false },
      testScore: { type: Number },
    }],
    currentTopic: { type: mongoose.Schema.Types.ObjectId, ref: "LanguageTopic" }
  }],
  totalPoints: { type: Number, default: 0 },
  hintsUsed: { type: Number, default: 0 },
  hintsUnlocked: { type: Number, default: 0 },
}, { timestamps: true });

const LearningProgress = mongoose.model("LearningProgress", learningProgressSchema);
export default LearningProgress;


