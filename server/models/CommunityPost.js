import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ['discussion', 'solution', 'code_review'],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 },
  replies: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
export default CommunityPost;
