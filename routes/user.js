import express from 'express';
import User from '../models/User.js';
import verify from './verifyToken.js';

import { editProfileValidation } from '../validation.js';
import Post from '../models/Post.js';

const router = express.Router();

// edit profile
router.put('/edit', verify, async (req, res) => {
  const { error } = editProfileValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updatedUser = { ...req.body };
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, updatedUser, {
      returnOriginal: false,
    });

    res.status(200).json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// get profile
router.get('/profile', verify, async (req, res) => {
  const { _id } = req.user;
  const totalPosts = await Post.where({ senderId: _id }).count();
  const totalLikes = await Post.where({ reactions: { $all: [_id] } }).count();
  const posts = await Post.find({ senderId: _id });
  const totalLikesReceived = posts.reduce(
    (accumulator, post) => accumulator + post.reactions.length,
    0
  );

  const user = await User.findOne({ _id });
  res.status(200).json({
    user: { ...user._doc, totalPosts, totalLikes, totalLikesReceived },
  });
});

//get info
router.post('/info', verify, async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json({
      message: 'User does not exist',
    });
  }

  const { name, email, avatar, phone, address, gender } = user;
  return res.status(200).json({
    message: 'Success',
    user: {
      name,
      email,
      avatar,
      phone,
      address,
      gender,
    },
  });
});

//upload avatar
router.post('/upload-avatar', verify, async (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: './uploads',
    keepExtensions: true,
    maxFieldsSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        data: {},
        message: 'Can not upload images. Error: ' + err,
      });
    }

    if (!files.images) {
      return res.status(400).json({
        data: {},
        message: 'No images were uploaded',
      });
    }
    const fileNames = files.images.newFilename;
    const updatedUser = {
      avatar: fileNames,
    };

    try {
      await User.findOneAndUpdate({ _id: req.user._id }, updatedUser, {
        returnOriginal: false,
      });
      return res.status(200).json({
        message: 'Upload avatar thành công',
        data: fileNames,
        numberOfImages: 1,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error: ' + error });
    }
  });
});

//get avatar
router.get('/avatar/:imageName', (req, res) => {
  const imageName = './uploads/' + req.params.imageName;
  fs.readFile(imageName, (err, data) => {
    if (err) {
      return res.json({ message: 'Cannot read images. ' + err });
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(data);
  });
});

export default router;
