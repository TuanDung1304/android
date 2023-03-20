import express from 'express';
import verify from './verifyToken.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
const router = express.Router();

// get one by id
router.post('/getOne', verify, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.body.postId });

    if (!post) return res.status(400).json({ message: 'Post not found' });
    return res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//get all
router.get('/getAll', verify, async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json({ posts });
});

// đăng bài
router.post('/create', verify, async (req, res) => {
  const { _id: userId } = req.user;
  const { content, title, images } = req.body;
  if (!content || !title) {
    return res.status(400).json({
      message: 'Nội dung hoặc tiêu đề không được bỏ trống',
    });
  }

  const post = new Post({ senderId: userId, content, title });

  try {
    await post.save();
    const notification = new Notification({
      actorId: userId,
      action: 'post',
      postId: post._id,
      images,
    });
    await notification.save();
    res.status(200).json({
      postId: post._id,
      message: 'Đăng bài viết thành công',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Đã xảy ra lỗi: ' + err,
    });
  }
});

// tim kiem post
router.post('/search', verify, async (req, res) => {
  const { search } = req.body;
  const posts = await Post.find({ title: { $regex: search, $options: 'i' } });
  res.json(posts);
});

// tương tác
router.post('/react', verify, async (req, res) => {
  const { _id: userId } = req.user;
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    return res.status(400).json({
      message: 'Post không tồn tại',
    });
  }
  const reactions = [...post.reactions];

  try {
    const index = reactions.indexOf(userId);
    let action = '';
    if (index !== -1) {
      reactions.splice(index, 1);
      action = 'Dislike';
    } else {
      reactions.push(userId);
      action = 'Like';
    }
    post.reactions = reactions;
    await Post.findOneAndUpdate({ _id: postId }, post, {
      returnOriginal: false,
    });

    if (action === 'Like') {
      const notification = new Notification({
        actorId: userId,
        action: 'like_post',
        postId,
      });
      await notification.save();
    } else if (action === 'Dislike') {
      await Notification.deleteOne({
        action: 'like_post',
        actorId: userId,
        postId,
      });
    }

    res.status(200).json({
      message: `${action} thành công`,
      postId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi: ' + err });
  }
});

//popular
router.get('/popular', verify, async (req, res) => {
  const posts = await Post.find({}).limit(10).sort({ createdAt: 'desc' });

  return res.status(200).json({ posts });
});

export default router;
