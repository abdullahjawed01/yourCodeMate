import CommunityPost from '../models/CommunityPost.js';
import mongoose from 'mongoose';

// GET all posts (with filtering)
export const getPosts = async (req, res) => {
  try {
    const { type, tag, search, sort = 'newest', page = 1, limit = 20 } = req.query;
    const query = {};

    if (type && type !== 'all') query.type = type;
    if (tag) query.tags = { $in: [tag] };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];

    const sortMap = {
      newest: { createdAt: -1 },
      top: { views: -1 },
      hot: { 'upvotes.0': -1 },
      oldest: { createdAt: 1 }
    };

    const posts = await CommunityPost.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'name email level points')
      .populate('replies.author', 'name email')
      .lean();

    const total = await CommunityPost.countDocuments(query);

    // Format posts for frontend
    const formatted = posts.map(p => ({
      ...p,
      upvoteCount: p.upvotes?.length || 0,
      replyCount: p.replies?.length || 0,
      isUpvoted: req.user ? p.upvotes?.some(id => id.toString() === req.user._id.toString()) : false,
    }));

    res.json({ posts: formatted, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single post
export const getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name email level points badges')
      .populate('replies.author', 'name email level');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const formatted = {
      ...post.toObject(),
      upvoteCount: post.upvotes.length,
      replyCount: post.replies.length,
      isUpvoted: req.user ? post.upvotes.some(id => id.toString() === req.user._id.toString()) : false,
    };

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE post
export const createPost = async (req, res) => {
  try {
    const { title, content, type, tags, code, language } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (!['discussion', 'solution', 'code_review'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      title: title.trim(),
      content: content.trim(),
      type,
      tags: tags || [],
      code: code || undefined,
      language: language || undefined,
    });

    await post.populate('author', 'name email level points');

    res.status(201).json({
      ...post.toObject(),
      upvoteCount: 0,
      replyCount: 0,
      isUpvoted: false,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPVOTE / un-upvote post
export const upvotePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const idx = post.upvotes.indexOf(userId);
    if (idx === -1) {
      post.upvotes.push(userId);
    } else {
      post.upvotes.splice(idx, 1);
    }
    await post.save();

    res.json({ upvoteCount: post.upvotes.length, isUpvoted: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD reply
export const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Reply cannot be empty' });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.replies.push({
      author: req.user._id,
      content: content.trim(),
    });
    await post.save();
    await post.populate('replies.author', 'name email level');

    const newReply = post.replies[post.replies.length - 1];
    res.status(201).json(newReply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE post (author or admin)
export const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET community stats
export const getStats = async (req, res) => {
  try {
    const [total, discussions, solutions, reviews] = await Promise.all([
      CommunityPost.countDocuments(),
      CommunityPost.countDocuments({ type: 'discussion' }),
      CommunityPost.countDocuments({ type: 'solution' }),
      CommunityPost.countDocuments({ type: 'code_review' }),
    ]);
    res.json({ total, discussions, solutions, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
