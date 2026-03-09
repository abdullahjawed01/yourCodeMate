import ChatMessage from '../models/Chat.js';
import User from '../models/User.js';

// Get all messages in a room
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.find({ room: roomId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { room, content, replyTo } = req.body;
    
    if (!content?.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const message = await ChatMessage.create({
      room,
      sender: req.user._id,
      senderName: req.user.name,
      content: content.trim(),
      replyTo: replyTo || undefined
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add/toggle reaction to a message
export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await ChatMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    const current = message.reactions.get(emoji) || 0;
    message.reactions.set(emoji, current + 1);
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's chat rooms (DMs with friends + global rooms)
export const getRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name');
    
    const dmRooms = user.friends.map(f => ({
      id: `dm_${[req.user._id, f._id].sort().join('_')}`,
      name: f.name,
      type: 'dm',
      friendId: f._id
    }));

    const globalRooms = [
      { id: 'group_general', name: '# general', type: 'group' },
      { id: 'group_algorithms', name: '# algorithms', type: 'group' },
      { id: 'group_javascript', name: '# javascript', type: 'group' },
      { id: 'group_python', name: '# python', type: 'group' },
    ];

    res.json({ rooms: [...dmRooms, ...globalRooms] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
