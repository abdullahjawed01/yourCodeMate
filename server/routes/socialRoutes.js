import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getFriends, 
  sendFriendRequest, 
  acceptFriendRequest, 
  declineFriendRequest,
  getSuggestions,
  removeFriend 
} from '../controllers/socialController.js';

const router = express.Router();

router.use(protect);

router.get('/friends', getFriends);
router.get('/suggestions', getSuggestions);
router.post('/friends/request', sendFriendRequest);
router.post('/friends/accept', acceptFriendRequest);
router.post('/friends/decline', declineFriendRequest);
router.delete('/friends/remove', removeFriend);

export default router;
