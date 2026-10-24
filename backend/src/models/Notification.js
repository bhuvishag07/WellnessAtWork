import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null indicates organization-wide broadcast
      index: true
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required']
    },
    type: {
      type: String,
      enum: ['challenge', 'session', 'leaderboard', 'reward', 'wellness', 'system'],
      default: 'system'
    },
    read: {
      type: Boolean,
      default: false
    },
    readBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []
    },
    actionLink: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // friendly time format helper
        ret.timestamp = ret.createdAt ? new Date(ret.createdAt).toLocaleString() : 'Just now';
        return ret;
      }
    }
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
