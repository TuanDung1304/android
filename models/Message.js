import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: String },
    senderId: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);
