import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import UserChallenge from '../models/UserChallenge.js';
import ActivityLog from '../models/ActivityLog.js';
import PointTransaction from '../models/PointTransaction.js';
import Notification from '../models/Notification.js';
import Team from '../models/Team.js';
import { calculateActivityPoints, checkMilestonesUnlocked } from '../utils/pointsCalculator.js';
import { emitSocketEvent, emitToUser } from '../sockets/socketHandler.js';
import { sendFirebasePush } from '../config/firebase.js';

export const logUserActivity = async ({
  userId,
  activityType,
  value,
  durationMinutes = 0,
  challengeId = null,
  source = 'manual',
  sourceEventId = null,
  notes = ''
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (sourceEventId) {
    const existingActivity = await ActivityLog.findOne({ userId: user._id, sourceEventId });
    if (existingActivity) {
      return {
        activity: existingActivity,
        earnedPoints: 0,
        totalNewPoints: 0,
        duplicate: true,
        milestoneUnlocked: null,
        isChallengeCompleted: false,
        updatedUser: {
          totalPoints: user.totalPoints,
          tier: user.tier,
          streakDays: user.streakDays
        }
      };
    }
  }

  // 1. Authoritative Point Calculation
  const earnedPoints = calculateActivityPoints({
    activityType,
    value,
    durationMinutes
  });

  // 2. Resolve challenge if linked
  let challenge = null;
  let userChallenge = null;
  let challengeTitle = 'Wellness Activity';

  if (challengeId) {
    // Challenge could be ObjectId or slug string
    challenge = await Challenge.findOne({
      $or: [
        { _id: challengeId.match(/^[0-9a-fA-F]{24}$/) ? challengeId : null },
        { slug: challengeId }
      ]
    });

    if (challenge) {
      challengeTitle = challenge.title;
      userChallenge = await UserChallenge.findOne({
        userId: user._id,
        challengeId: challenge._id
      });
    }
  }

  // 3. Save Activity Log
  let activity;
  try {
    activity = await ActivityLog.create({
    userId: user._id,
    challengeId: challenge ? challenge._id : null,
    challengeTitle,
    activityType,
    category: activityType.toLowerCase().includes('meditat') ? 'Mindfulness' : 'Fitness',
    value: String(value),
    numericValue: parseFloat(String(value).replace(/,/g, '')) || 0,
    unit: activityType.toLowerCase().includes('walk') ? 'steps' : 'minutes',
    durationMinutes: Number(durationMinutes) || 0,
    pointsEarned: earnedPoints,
    source,
    sourceEventId,
    notes,
      timestamp: new Date()
    });
  } catch (error) {
    if (error.code !== 11000 || !sourceEventId) throw error;
    const existingActivity = await ActivityLog.findOne({ userId: user._id, sourceEventId });
    if (!existingActivity) throw error;
    return {
      activity: existingActivity,
      earnedPoints: 0,
      totalNewPoints: 0,
      duplicate: true,
      milestoneUnlocked: null,
      isChallengeCompleted: false,
      updatedUser: {
        totalPoints: user.totalPoints,
        tier: user.tier,
        streakDays: user.streakDays
      }
    };
  }

  // 4. Update User Points and Streak
  let totalNewPoints = earnedPoints;
  const previousStreak = user.streakDays || 0;
  user.streakDays = previousStreak + 1;
  user.totalPoints += earnedPoints;
  user.updateTier();
  await user.save();

  // 5. Point Transaction Record
  await PointTransaction.create({
    userId: user._id,
    type: 'earned',
    points: earnedPoints,
    source: 'activity',
    description: `Logged ${value} for ${challengeTitle}`,
    balanceAfter: user.totalPoints,
    relatedActivity: activity._id
  });

  // 6. Update Challenge Progress and Milestones
  let milestoneUnlocked = null;
  let isChallengeCompleted = false;

  if (userChallenge && challenge) {
    const prevProgress = userChallenge.currentProgress || 0;
    // Increment progress (e.g. +5% per log or calculate against goal)
    const newProgress = Math.min(100, prevProgress + 5);
    userChallenge.currentProgress = newProgress;
    userChallenge.lastLoggedAt = new Date();

    // Check for milestones
    const unlockedList = checkMilestonesUnlocked(challenge, prevProgress, newProgress);
    if (unlockedList.length > 0) {
      milestoneUnlocked = unlockedList[0];
      const bonusPts = milestoneUnlocked.points || 50;
      user.totalPoints += bonusPts;
      user.updateTier();
      await user.save();

      await PointTransaction.create({
        userId: user._id,
        type: 'earned',
        points: bonusPts,
        source: 'milestone',
        description: `Milestone Unlocked: ${milestoneUnlocked.label}`,
        balanceAfter: user.totalPoints
      });

      totalNewPoints += bonusPts;
    }

    // Check Challenge Completion
    if (newProgress >= 100 && !userChallenge.completed) {
      userChallenge.completed = true;
      userChallenge.completedAt = new Date();
      isChallengeCompleted = true;

      // Completion bonus points
      const bonusPts = challenge.rewardPoints || 100;
      user.totalPoints += bonusPts;
      user.updateTier();
      await user.save();

      await PointTransaction.create({
        userId: user._id,
        type: 'earned',
        points: bonusPts,
        source: 'challenge_completion',
        description: `Completed Challenge: ${challenge.title}`,
        balanceAfter: user.totalPoints
      });

      totalNewPoints += bonusPts;
    }

    await userChallenge.save();

    // Also update team points if enrolled with a team
    if (userChallenge.teamId) {
      await Team.findByIdAndUpdate(userChallenge.teamId, {
        $inc: { totalPoints: earnedPoints }
      });
    }
  }

  // 7. Internal Notification Record
  const notif = await Notification.create({
    recipient: user._id,
    title: `+${earnedPoints} Points Logged! ✨`,
    message: `You recorded ${value} for ${challengeTitle}. Keep up the great streak!`,
    type: 'challenge',
    actionLink: challenge ? `/challenges/${challenge.slug || challenge._id}` : '/dashboard'
  });

  // 8. Socket.io Real-Time Broadcasts
  emitToUser(user._id, 'notification:push', {
    id: notif._id,
    title: notif.title,
    message: notif.message,
    type: 'points',
    actionLink: notif.actionLink
  });

  emitSocketEvent('activity:logged', {
    title: 'Activity Logged',
    message: `${user.fullName} logged ${value} ${activity.unit}! +${earnedPoints} points`,
    user: { id: user._id, name: user.fullName, department: user.department },
    points: earnedPoints,
    type: 'points'
  });

  emitSocketEvent('leaderboard:updated', {
    updatedUserId: user._id,
    newPoints: user.totalPoints,
    department: user.department
  });

  if (milestoneUnlocked) {
    emitSocketEvent('challenge:milestone', {
      user: user.fullName,
      challenge: challengeTitle,
      milestone: milestoneUnlocked.label,
      bonus: milestoneUnlocked.points
    });
  }

  if (isChallengeCompleted) {
    emitSocketEvent('challenge:completed', {
      user: user.fullName,
      challenge: challengeTitle,
      rewardPoints: challenge.rewardPoints
    });
  }

  // 9. Firebase Cloud Messaging Push
  if (user.firebaseDeviceTokens && user.firebaseDeviceTokens.length > 0) {
    sendFirebasePush({
      tokens: user.firebaseDeviceTokens,
      title: `+${earnedPoints} Points Earned!`,
      body: `Awesome job! Your ${activityType} activity was recorded.`,
      data: { activityId: activity._id.toString() }
    }).catch(err => console.warn('[Firebase FCM warning]', err.message));
  }

  return {
    activity,
    earnedPoints,
    totalNewPoints,
    duplicate: false,
    milestoneUnlocked,
    isChallengeCompleted,
    updatedUser: {
      totalPoints: user.totalPoints,
      tier: user.tier,
      streakDays: user.streakDays
    }
  };
};
