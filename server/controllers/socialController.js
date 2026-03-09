import User from '../models/User.js';

// Get current user's friends list
export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name email points level streak badges createdAt')
      .populate('friendRequests', 'name email points level streak createdAt');

    // Find users who have this user's ID in their friendRequests array
    const sentRequests = await User.find({ friendRequests: req.user._id })
      .select('name email points level streak createdAt');

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests,
      friendRequestsSent: sentRequests
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id.toString();
    
    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You can't add yourself" });
    }

    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    // Check if already friends
    const isAlreadyFriend = target.friends.some(id => id.toString() === currentUserId);
    if (isAlreadyFriend) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already sent
    const hasRequest = target.friendRequests.some(id => id.toString() === currentUserId);
    if (hasRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    target.friendRequests.push(req.user._id);
    await target.save();

    res.json({ message: 'Friend request sent!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const myId = req.user._id;
    
    const me = await User.findById(myId);
    const requester = await User.findById(requesterId);

    if (!requester) return res.status(404).json({ message: 'User not found' });

    // Remove from pending requests
    me.friendRequests = me.friendRequests.filter(id => id.toString() !== requesterId);
    
    // Add to friends on both sides - check if not already there
    if (!me.friends.some(id => id.toString() === requesterId)) {
      me.friends.push(requesterId);
    }
    if (!requester.friends.some(id => id.toString() === myId.toString())) {
      requester.friends.push(myId);
    }

    await me.save();
    await requester.save();

    res.json({ message: 'Friend request accepted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Decline a friend request
export const declineFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    
    const me = await User.findById(req.user._id);
    me.friendRequests = me.friendRequests.filter(id => id.toString() !== requesterId);
    await me.save();

    res.json({ message: 'Friend request declined' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get suggested users (not already friends AND not already requested)
export const getSuggestions = async (req, res) => {
  try {
    const myId = req.user._id;
    const me = await User.findById(myId);
    
    // 1. Exclude self and friends
    const excludeIds = [...me.friends, myId];
    
    // 2. Also exclude people I've already sent requests to
    // We find these by searching users who have myId in their friendRequests
    const alreadyRequested = await User.find({ friendRequests: myId }).select('_id');
    const requestedIds = alreadyRequested.map(u => u._id);
    
    const finalExclude = [...excludeIds, ...requestedIds];
    
    const suggestions = await User.find({ _id: { $nin: finalExclude } })
      .select('name email points level streak')
      .sort({ points: -1 })
      .limit(12);

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    
    const me = await User.findById(req.user._id);
    const friend = await User.findById(friendId);
    
    me.friends = me.friends.filter(id => id.toString() !== friendId);
    if (friend) {
      friend.friends = friend.friends.filter(id => id.toString() !== req.user._id.toString());
      await friend.save();
    }
    await me.save();

    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
