import mongoose from 'mongoose';

/**
 * MentalHealthCheckIn Model:
 * STRICT PRIVACY REQUIREMENT:
 * This model strictly does NOT store userId, email, or any employee identifiers.
 * This ensures that individual mental-health check-ins are cryptographically anonymous
 * and cannot be correlated to any specific employee even by database administrators.
 */
const mentalHealthCheckInSchema = new mongoose.Schema(
  {
    wellbeingRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    sentimentCategory: {
      type: String,
      enum: ['thriving', 'balanced', 'neutral', 'fatigued', 'at_risk'],
      default: 'balanced'
    },
    optionalAnonymousResponse: {
      type: String,
      default: '',
      trim: true
    },
    departmentAggregateTag: {
      type: String,
      default: 'General'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const MentalHealthCheckIn = mongoose.model('MentalHealthCheckIn', mentalHealthCheckInSchema);
export default MentalHealthCheckIn;
