import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const teamChallengeParticipationSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    },
    currentProgress: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      unique: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    members: {
      type: [memberSchema],
      default: []
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    challengeParticipation: {
      type: [teamChallengeParticipationSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.memberCount = ret.members ? ret.members.length : 0;
        return ret;
      }
    }
  }
);

export const Team = mongoose.model('Team', teamSchema);
export default Team;
