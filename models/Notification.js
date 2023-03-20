import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    actorId: { type: String },
    postId: { type: String },
    action: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Notification', NotificationSchema);
