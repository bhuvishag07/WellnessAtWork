import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Engineering'
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee'
    },
    tokenVersion: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    tier: {
      type: String,
      default: 'Bronze Starter'
    },
    streakDays: {
      type: Number,
      default: 0,
      min: 0
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    },
    firebaseUid: {
      type: String,
      sparse: true
    },
    firebaseDeviceTokens: {
      type: [String],
      default: []
    },
    notificationPreferences: {
      challengeAlerts: { type: Boolean, default: true },
      sessionReminders: { type: Boolean, default: true },
      rewardUpdates: { type: Boolean, default: true },
      emailWeeklyDigest: { type: Boolean, default: true },
      leaderboardAlerts: { type: Boolean, default: true }
    },
    privacySettings: {
      leaderboardVisibility: { type: Boolean, default: true },
      shareStepCounts: { type: Boolean, default: true },
      counselingConfidentialityFence: { type: Boolean, default: true },
      activityFeedVisibility: { type: String, default: 'colleagues' }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.tokenVersion;
        delete ret.firebaseUid;
        delete ret.firebaseDeviceTokens;
        ret.id = ret._id.toString();
        ret.firstName = ret.fullName ? ret.fullName.split(' ')[0] : '';
        return ret;
      }
    }
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

// Helper method to compute and update user tier based on points
userSchema.methods.updateTier = function () {
  if (this.totalPoints >= 2000) {
    this.tier = 'Grandmaster Champion';
  } else if (this.totalPoints >= 1500) {
    this.tier = 'Gold Elite';
  } else if (this.totalPoints >= 800) {
    this.tier = 'Silver Pioneer';
  } else {
    this.tier = 'Bronze Starter';
  }
};

export const User = mongoose.model('User', userSchema);
export default User;
