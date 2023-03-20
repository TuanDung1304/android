import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    membersId: { type: Array },
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', ConversationSchema);
