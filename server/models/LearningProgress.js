import mongoose from "mongoose";

const learningProgressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
    unique: true
  },
  pythonTopics: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "PythonTopic" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    pointsEarned: { type: Number, default: 0 },
    testPassed: { type: Boolean, default: false },
    testScore: { type: Number },
  }],
  javascriptTopics: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "JavascriptTopic" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    pointsEarned: { type: Number, default: 0 },
    testPassed: { type: Boolean, default: false },
    testScore: { type: Number },
  }],
  currentTopic: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PythonTopic" 
  },
  currentJsTopic: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "JavascriptTopic" 
  },
  totalPoints: { type: Number, default: 0 },
  hintsUsed: { type: Number, default: 0 },
  hintsUnlocked: { type: Number, default: 0 },
}, { timestamps: true });

const LearningProgress = mongoose.model("LearningProgress", learningProgressSchema);
export default LearningProgress;


