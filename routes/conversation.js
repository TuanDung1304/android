import express, { json } from 'express';
import Conversation from '../models/Conversation.js';
import verify from './verifyToken.js';
const router = express.Router();

//new conversation
router.post('/create', verify, async (req, res) => {
  const { _id: senderId } = req.user;
  const { receiverId } = req.body;
  const exist = await Conversation.findOne({
    membersId: [senderId, receiverId],
  });
  if (exist) {
    return res.status(400).json({
      message: 'Conversation already exists',
    });
  }
  const newConversation = new Conversation({
    membersId: [senderId, receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json({ newConversation: savedConversation });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// get conversation of an user
router.get('/', verify, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      membersId: { $in: [req.user._id] },
    });
    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
