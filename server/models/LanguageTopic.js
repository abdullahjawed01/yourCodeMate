import mongoose from "mongoose";

const languageTopicSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'rust', 'ruby', 'swift'],
    required: true
  },
  title: { type: String, required: true },
  slug: { type: String, required: true }, // Not globally unique anymore, scoped to language
  description: { type: String, required: true },
  content: { type: String, required: true }, // Markdown content
  order: { type: Number, required: true },
  category: { 
    type: String,
    required: true 
  },
  prerequisites: [{ type: String }], // Slugs of required topics
  pointsReward: { type: Number, default: 10 },
  estimatedTime: { type: Number, default: 15 }, // minutes
  testId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "CodingTest",
  }, // Test to unlock next topic
  unlocked: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure slugs are unique per language
languageTopicSchema.index({ language: 1, slug: 1 }, { unique: true });

const LanguageTopic = mongoose.model("LanguageTopic", languageTopicSchema);
export default LanguageTopic;
