import express from 'express';
import { verify } from 'jsonwebtoken';
import Notification from '../models/Notification.js';
const router = express.Router();

router.post('/getByPost', verify, async (req, res) => {
  try {
    const notifications = await Notification.find({
      postId: req.body.postId,
    });

    return res.status(200).json({ notifications });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/', verify, async (req, res) => {
  const notifications = await Notification.find({});
  return res.status(200).json({ notifications });
});

export default router;
