import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import verify from './verifyToken.js';
import formidable from 'formidable';
import fs from 'fs';
import {
  changePassValidation,
  editProfileValidation,
  loginValidation,
  registerValidation,
} from '../validation.js';
const router = express.Router();

// Register---------------------------
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    phone,
    gender,
    address,
    birthdate,
    avatar,
  } = req.body;

  // Lets validate
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user is already in the db
  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res.status(400).json({
      message: 'Email already exists',
    });

  //confirm password
  if (password !== confirmPassword) {
    res.status(200).json({
      success: false,
      message: 'Mật khẩu nhập lại không đúng',
    });
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name,
    email,
    password: hashPassword,
    phone,
    permission: 2,
    active: true,
    gender,
    address,
    birthdate,
    avatar,
  });
  try {
    await user.save();
    res.status(200).json({
      message: 'Đăng ký thành công',
      user: user._id,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
});

// Login---------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Lets validate
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the email exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Email is not found');

  // Password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 7200,
  });
  res.status(200).header('Authorization', token).json({
    token,
    id: user._id,
    permission: user.permission,
  });
});

// Change password---------------------------
router.put('/change-password', verify, async (req, res) => {
  const { password, newPassword, confirmPassword } = req.body;
  //valitation
  const { error } = changePassValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find User
  const user = await User.findOne({ _id: req.user._id });
  const { email, password: currentPassword } = user;

  // check password
  const validPassword = await bcrypt.compare(password, currentPassword);
  if (!validPassword)
    return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Mật khẩu nhập lại không đúng' });

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = {
    email,
    password: hashPassword,
  };

  try {
    await User.findOneAndUpdate({ _id: req.user._id }, updatedUser, {
      returnOriginal: false,
    });

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.json(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

export default router;
