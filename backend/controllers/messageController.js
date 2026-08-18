const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message to another user
// @route   POST /api/messages
// @access  Private (Student / Company)
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, messageText } = req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      messageText
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation chat thread with a specific user
// @route   GET /api/messages/:userId
// @access  Private (Student / Company)
exports.getConversation = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id }
      ]
    })
      .sort('createdAt')
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, recipient: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent chat conversations list
// @route   GET /api/messages/recent/chats
// @access  Private (Student / Company)
exports.getRecentChats = async (req, res, next) => {
  try {
    // Find all messages involving user
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }]
    })
      .sort('-createdAt')
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    const chatsMap = new Map();

    for (const msg of messages) {
      const otherUser = msg.sender._id.toString() === req.user.id.toString() ? msg.recipient : msg.sender;
      const otherUserId = otherUser._id.toString();

      if (!chatsMap.has(otherUserId)) {
        chatsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.messageText,
          time: msg.createdAt,
          unread: !msg.read && msg.recipient._id.toString() === req.user.id.toString()
        });
      }
    }

    const recentChats = Array.from(chatsMap.values());
    res.status(200).json({ success: true, data: recentChats });
  } catch (error) {
    next(error);
  }
};
