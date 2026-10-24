import mongoose from 'mongoose';

const wellnessResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      default: 'Mental Well-being'
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    type: {
      type: String,
      default: 'Article & Framework'
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    audioUrl: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: ['Wellness']
    },
    icon: {
      type: String,
      default: 'Brain'
    },
    isInteractiveBreath: {
      type: Boolean,
      default: false
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
        return ret;
      }
    }
  }
);

export const WellnessResource = mongoose.model('WellnessResource', wellnessResourceSchema);
export default WellnessResource;
