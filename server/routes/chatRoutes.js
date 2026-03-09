import express from 'express';
import { getMessages, sendMessage, addReaction, getRooms } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/rooms', getRooms);
router.get('/messages/:roomId', getMessages);
router.post('/messages', sendMessage);
router.post('/messages/:messageId/react', addReaction);

export default router;
