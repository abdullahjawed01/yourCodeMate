import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // roomId: 'dm_<userId1>_<userId2>' or 'group_<name>'
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  reactions: { type: Map, of: Number, default: {} },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

messageSchema.index({ room: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', messageSchema);
export default ChatMessage;
