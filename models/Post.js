import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    reactions: {
      type: Array,
      default: [],
    },
    images: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', PostSchema);
