import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    label: { type: String, required: true },
    points: { type: Number, required: true, default: 50 },
    completed: { type: Boolean, default: false }
  },
  { _id: false }
);

const challengeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      default: 'Steps & Fitness'
    },
    categoryKey: {
      type: String,
      default: 'steps'
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      default: '30 Days'
    },
    targetGoal: {
      type: String,
      required: true,
      default: '10,000 steps / day'
    },
    unit: {
      type: String,
      default: 'steps'
    },
    rewardPoints: {
      type: Number,
      required: true,
      default: 200
    },
    totalDays: {
      type: Number,
      default: 30
    },
    currentDay: {
      type: Number,
      default: 1
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    milestones: {
      type: [milestoneSchema],
      default: []
    },
    eligibleDepartments: {
      type: [String],
      default: ['All Departments']
    },
    teamChallenge: {
      isTeam: { type: Boolean, default: false },
      minTeamMembers: { type: Number, default: 2 },
      maxTeamMembers: { type: Number, default: 10 }
    },
    participantsCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'upcoming', 'available'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret.slug || ret._id.toString();
        ret.mongoId = ret._id.toString();
        return ret;
      }
    }
  }
);

export const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
