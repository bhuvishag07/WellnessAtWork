import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
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
      index: true
    },
    challengeTitle: {
      type: String,
      default: ''
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'Fitness'
    },
    value: {
      type: String,
      required: [true, 'Activity value is required']
    },
    numericValue: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'steps'
    },
    durationMinutes: {
      type: Number,
      default: 0
    },
    pointsEarned: {
      type: Number,
      required: true,
      default: 0
    },
    source: {
      type: String,
      enum: ['manual', 'wearable', 'system'],
      default: 'manual'
    },
    sourceEventId: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      default: ''
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
        ret.type = ret.activityType;
        ret.points = ret.pointsEarned;
        ret.duration = ret.durationMinutes;
        return ret;
      }
    }
  }
);

activityLogSchema.index(
  { userId: 1, sourceEventId: 1 },
  { unique: true, partialFilterExpression: { sourceEventId: { $type: 'string' } } }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
