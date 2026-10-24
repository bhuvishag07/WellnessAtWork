import mongoose from 'mongoose';

const userChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true
    },
    currentProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    lastLoggedAt: {
      type: Date
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    milestonesReached: {
      type: [Number],
      default: []
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

// Compound index to prevent duplicate enrollment
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);
export default UserChallenge;
