import mongoose from 'mongoose';

const rewardLedgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
      required: true
    },
    rewardTitle: {
      type: String,
      required: true
    },
    pointsSpent: {
      type: Number,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['claimed', 'fulfilled', 'cancelled'],
      default: 'claimed'
    },
    redemptionDate: {
      type: Date,
      default: Date.now
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

export const RewardLedger = mongoose.model('RewardLedger', rewardLedgerSchema);
export default RewardLedger;
