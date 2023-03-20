import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import verify from './verifyToken.js';
const router = express.Router();

//add
router.post('/create', verify, async (req, res) => {
  const { content, conversationId } = req.body;
  if (!content) {
    return res
      .status(400)
      .json({ message: 'Nội dung tin nhắn không được bỏ trống' });
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  if (!conversation) {
    return res.status(400).json({ message: 'Cuộc trò chuyện không tồn tại' });
  }
  if (!conversation.membersId.includes(req.user._id)) {
    return res
      .status(400)
      .json({ message: 'Bạn không có trong cuộc trò chuyện này' });
  }

  const newMessage = new Message({
    content,
    conversationId,
    senderId: req.user._id,
  });
  try {
    const saveMessage = await newMessage.save();
    res.status(200).json({ newMessage: saveMessage });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//get
router.post('/getByConversation', verify, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.body.conversationId,
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
