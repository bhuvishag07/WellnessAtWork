import mongoose from 'mongoose';

const sessionBookingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['1-on-1 Counseling', 'Yoga / Desk Stretching', 'Guided Meditation', 'Nutrition & Vitality', 'Other']
    },
    categoryBadge: {
      type: String,
      default: 'Confidential Care'
    },
    facilitator: {
      type: String,
      required: true
    },
    facilitatorTitle: {
      type: String,
      default: ''
    },
    facilitatorAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    date: {
      type: String,
      default: 'Tomorrow'
    },
    time: {
      type: String,
      default: '3:30 PM - 4:15 PM'
    },
    duration: {
      type: String,
      default: '45 mins'
    },
    mode: {
      type: String,
      default: 'Private Video Consultation'
    },
    description: {
      type: String,
      default: ''
    },
    availableSlots: {
      type: Number,
      default: 1
    },
    maxSlots: {
      type: Number,
      default: 1
    },
    bookedUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        bookedAt: {
          type: Date,
          default: Date.now
        },
        notes: {
          type: String,
          default: ''
        }
      }
    ],
    status: {
      type: String,
      enum: ['available', 'booked', 'completed', 'cancelled'],
      default: 'available'
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

export const SessionBooking = mongoose.model('SessionBooking', sessionBookingSchema);
export default SessionBooking;
