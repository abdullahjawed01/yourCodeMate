import express from 'express';
import { getContests, getContest, createContest, joinContest } from '../controllers/contestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getContests);
router.post('/', protect, createContest); // Ideally require restrictTo('admin')

router.get('/:id', getContest);
router.post('/:id/join', protect, joinContest);

export default router;
