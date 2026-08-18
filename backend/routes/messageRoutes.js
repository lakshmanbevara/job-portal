const express = require('express');
const { sendMessage, getConversation, getRecentChats } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/conversation/:userId', getConversation);
router.get('/recent/chats', getRecentChats);

module.exports = router;
