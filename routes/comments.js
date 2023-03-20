import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import verify from './verifyToken.js';
import Notification from '../models/Notification.js';
const router = express.Router();

//get comment of post
router.post('/getByPost', verify, async (req, res) => {
  const { postId } = req.body;
  const comments = await Comment.find({ postId });
  return res.status(200).json({
    comments,
  });
});

//comment
router.post('/', verify, async (req, res) => {
  const { _id: userId } = req.user;
  const { content, postId } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Nội dung không được bỏ trống' });
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json({ message: 'User không tồn tại' });
  }
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    return res.status(400).json({
      message: 'Post không tồn tại',
    });
  }
  const comment = new Comment({ content, senderId: userId, postId });

  try {
    await comment.save();
    const notification = new Notification({
      actorId: userId,
      action: 'comment',
      postId,
    });
    await notification.save();
    res.status(200).json({
      message: 'Comment thành công',
      commentId: comment._id,
      postId,
      content,
    });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

// tuong tac
router.post('/react', verify, async (req, res) => {
  const { _id: userId } = req.user;
  const { commentId } = req.body;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    return res.status(400).json({
      message: 'Comment không tồn tại',
    });
  }
  const reactions = [...comment.reactions];
  try {
    let action = '';
    const index = reactions.indexOf(userId);
    if (index !== -1) {
      reactions.splice(index, 1);
      action = 'Dislike';
    } else {
      reactions.push(userId);
      action = 'Like';
    }
    comment.reactions = reactions;
    await Comment.findOneAndUpdate({ _id: commentId }, comment, {
      returnOriginal: false,
    });
    res.status(200).json({
      message: `${action} thành công`,
      commentId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

export default router;
