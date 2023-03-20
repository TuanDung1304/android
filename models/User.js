import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 8,
    },
    phone: {
      type: String,
      length: 10,
    },
    permission: {
      type: Number,
      required: true,
      default: 2,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: Boolean,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
