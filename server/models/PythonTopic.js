import mongoose from "mongoose";

const pythonTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  content: { type: String, required: true }, // Markdown content
  order: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['basics', 'data-types', 'functions', 'oop', 'advanced'],
    required: true 
  },
  prerequisites: [{ type: String }], // Slugs of required topics
  pointsReward: { type: Number, default: 10 },
  estimatedTime: { type: Number, default: 15 }, // minutes
  testId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "CodingTest",
    required: true 
  }, // Test to unlock next topic
  unlocked: { type: Boolean, default: false },
}, { timestamps: true });

const PythonTopic = mongoose.model("PythonTopic", pythonTopicSchema);
export default PythonTopic;


