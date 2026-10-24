import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'Daily Treats'
    },
    pointsCost: {
      type: Number,
      required: true,
      min: 1
    },
    partner: {
      type: String,
      default: 'Corporate Wellness Partner'
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=350&q=80'
    },
    stock: {
      type: Number,
      default: 100
    },
    active: {
      type: Boolean,
      default: true
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

export const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
