const express = require('express');
const router = express.Router();
const { getConversations, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/:otherUserId', protect, getMessages);

module.exports = router;
