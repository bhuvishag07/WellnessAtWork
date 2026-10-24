import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Webinar title is required'],
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    facilitator: {
      type: String,
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/waw-wellness'
    },
    capacity: {
      type: Number,
      default: 100
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.registeredCount = ret.participants ? ret.participants.length : 0;
        return ret;
      }
    }
  }
);

export const Webinar = mongoose.model('Webinar', webinarSchema);
export default Webinar;
