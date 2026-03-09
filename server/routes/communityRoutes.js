import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getPosts, getPost, createPost, upvotePost, addReply, deletePost, getStats
} from '../controllers/communityController.js';

const router = express.Router();

// Public routes (also work for authenticated users — populate isUpvoted)
router.get('/stats', getStats);
router.get('/', protect, getPosts);
router.get('/:id', protect, getPost);

// Protected routes
router.post('/', protect, createPost);
router.post('/:id/upvote', protect, upvotePost);
router.post('/:id/reply', protect, addReply);
router.delete('/:id', protect, deletePost);

export default router;
