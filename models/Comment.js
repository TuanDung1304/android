import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    postId: {
      type: String,
      require: true,
    },
    reactions: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
