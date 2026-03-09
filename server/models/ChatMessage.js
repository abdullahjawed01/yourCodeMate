import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: String, required: true }, // Can be 'global', 'battle_XXX', 'dm_XXX'
  content: { type: String, required: true },
  reactions: {
    type: Map,
    of: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage" }
}, { timestamps: true });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
