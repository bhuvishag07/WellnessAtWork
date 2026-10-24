import mongoose from 'mongoose';

const pointTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['earned', 'spent'],
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 1
    },
    source: {
      type: String,
      enum: ['activity', 'milestone', 'challenge_completion', 'reward_redemption', 'bonus', 'admin_adjustment'],
      default: 'activity'
    },
    description: {
      type: String,
      required: true
    },
    balanceAfter: {
      type: Number,
      default: 0
    },
    relatedActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActivityLog'
    },
    relatedReward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

export const PointTransaction = mongoose.model('PointTransaction', pointTransactionSchema);
export default PointTransaction;
