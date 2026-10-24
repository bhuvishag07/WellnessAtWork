import User from '../models/User.js';
import UserChallenge from '../models/UserChallenge.js';
import Challenge from '../models/Challenge.js';
import ActivityLog from '../models/ActivityLog.js';
import SessionBooking from '../models/SessionBooking.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getDashboard = async (req, res, next) => {
  try {
    const user = req.user;

    // 1. Dynamic Rank Calculation: users with more points + 1
    const higherPointUsers = await User.countDocuments({
      role: 'employee',
      totalPoints: { $gt: user.totalPoints }
    });
    const currentRank = higherPointUsers + 1;

    // 2. Active & Completed Challenges
    const enrollments = await UserChallenge.find({ userId: user._id }).populate('challengeId');
    const activeChallenges = [];
    let activeChallengesCount = 0;
    let completedChallengesCount = 0;

    for (const e of enrollments) {
      if (e.completed) {
        completedChallengesCount++;
      } else {
        activeChallengesCount++;
        if (e.challengeId) {
          const cJson = e.challengeId.toJSON();
          cJson.progress = e.currentProgress;
          cJson.joined = true;
          cJson.completed = false;
          activeChallenges.push(cJson);
        }
      }
    }

    // 3. Upcoming Booked Sessions
    const upcomingSessionsCount = await SessionBooking.countDocuments({
      'bookedUsers.userId': user._id,
      status: { $ne: 'cancelled' }
    });

    // 4. Recent Activities (last 5)
    const recentActivities = await ActivityLog.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(5);

    // 5. Unread Notifications Count
    const unreadNotificationsCount = await Notification.countDocuments({
      $or: [{ recipient: user._id }, { recipient: null }],
      read: false
    });

    // 6. Tier Calculation
    const nextTierPoints = user.totalPoints < 800 ? 800 : user.totalPoints < 1500 ? 1500 : 2000;
    const progressPercentage = Math.min(100, Math.round((user.totalPoints / nextTierPoints) * 100));

    return successResponse(res, {
      message: 'Dashboard data retrieved',
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          firstName: user.fullName.split(' ')[0],
          email: user.email,
          department: user.department,
          role: user.role,
          totalPoints: user.totalPoints,
          tier: user.tier,
          nextTierPoints,
          streakDays: user.streakDays,
          currentRank,
          activeChallengesCount,
          completedChallengesCount,
          upcomingSessionsCount,
          progressPercentage,
          avatarUrl: user.avatar,
          privacySettings: user.privacySettings,
          notificationPreferences: user.notificationPreferences
        },
        activeChallenges,
        recentActivities,
        unreadNotificationsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, department } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName) user.fullName = fullName.trim();
    if (department) user.department = department.trim();

    await user.save();

    return successResponse(res, {
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl) {
      return errorResponse(res, { statusCode: 400, message: 'avatarUrl is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    return successResponse(res, {
      message: 'Avatar updated successfully',
      data: { user, avatarUrl: user.avatar }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrivacy = async (req, res, next) => {
  try {
    const { leaderboardVisibility, shareStepCounts, counselingConfidentialityFence, activityFeedVisibility } = req.body;
    const user = await User.findById(req.user._id);

    user.privacySettings = {
      ...user.privacySettings,
      ...(leaderboardVisibility !== undefined && { leaderboardVisibility }),
      ...(shareStepCounts !== undefined && { shareStepCounts }),
      ...(counselingConfidentialityFence !== undefined && { counselingConfidentialityFence }),
      ...(activityFeedVisibility !== undefined && { activityFeedVisibility })
    };

    await user.save();

    return successResponse(res, {
      message: 'Privacy settings saved successfully',
      data: { privacySettings: user.privacySettings }
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotifications = async (req, res, next) => {
  try {
    const { challengeAlerts, sessionReminders, rewardUpdates, emailWeeklyDigest } = req.body;
    const user = await User.findById(req.user._id);

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...(challengeAlerts !== undefined && { challengeAlerts }),
      ...(sessionReminders !== undefined && { sessionReminders }),
      ...(rewardUpdates !== undefined && { rewardUpdates }),
      ...(emailWeeklyDigest !== undefined && { emailWeeklyDigest })
    };

    await user.save();

    return successResponse(res, {
      message: 'Notification settings saved successfully',
      data: { notificationPreferences: user.notificationPreferences }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Both current and new passwords are required'
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Incorrect current password'
      });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    user.tokenVersion += 1;
    await user.save();

    return successResponse(res, {
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
