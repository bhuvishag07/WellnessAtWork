import Challenge from '../models/Challenge.js';
import UserChallenge from '../models/UserChallenge.js';
import Notification from '../models/Notification.js';
import { emitSocketEvent, emitToUser } from '../sockets/socketHandler.js';

export const getAllChallenges = async (userId = null) => {
  const challenges = await Challenge.find().sort({ createdAt: -1 });

  let userEnrollments = [];
  if (userId) {
    userEnrollments = await UserChallenge.find({ userId });
  }

  const enrollmentMap = new Map();
  userEnrollments.forEach(e => {
    enrollmentMap.set(e.challengeId.toString(), e);
  });

  return challenges.map(c => {
    const json = c.toJSON();
    const enrollment = enrollmentMap.get(c._id.toString());
    json.joined = !!enrollment;
    json.completed = enrollment ? enrollment.completed : false;
    json.progress = enrollment ? enrollment.currentProgress : 0;
    return json;
  });
};

export const getChallengeById = async (idOrSlug, userId = null) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const challenge = await Challenge.findOne({
    $or: [
      { _id: isObjectId ? idOrSlug : null },
      { slug: idOrSlug }
    ]
  });

  if (!challenge) {
    const error = new Error('Challenge not found');
    error.statusCode = 404;
    throw error;
  }

  const json = challenge.toJSON();
  if (userId) {
    const enrollment = await UserChallenge.findOne({
      userId,
      challengeId: challenge._id
    });
    json.joined = !!enrollment;
    json.completed = enrollment ? enrollment.completed : false;
    json.progress = enrollment ? enrollment.currentProgress : 0;
  }

  return json;
};

export const joinChallenge = async (idOrSlug, userId, teamId = null) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const challenge = await Challenge.findOne({
    $or: [
      { _id: isObjectId ? idOrSlug : null },
      { slug: idOrSlug }
    ]
  });

  if (!challenge) {
    const error = new Error('Challenge not found');
    error.statusCode = 404;
    throw error;
  }

  if (challenge.status !== 'active' && challenge.status !== 'available') {
    const error = new Error('This challenge is currently not open for enrollment.');
    error.statusCode = 400;
    throw error;
  }

  // Prevent duplicate enrollment
  const existing = await UserChallenge.findOne({
    userId,
    challengeId: challenge._id
  });

  if (existing) {
    const error = new Error('You are already enrolled in this challenge.');
    error.statusCode = 400;
    throw error;
  }

  const userChallenge = await UserChallenge.create({
    userId,
    challengeId: challenge._id,
    currentProgress: 0,
    teamId: teamId || null,
    joinedAt: new Date()
  });

  // Increment participant count
  challenge.participantsCount += 1;
  await challenge.save();

  // Create notification
  const notif = await Notification.create({
    recipient: userId,
    title: 'Challenge Joined! 🎯',
    message: `You joined "${challenge.title}". Start logging activities to earn points!`,
    type: 'challenge',
    actionLink: `/challenges/${challenge.slug || challenge._id}`
  });

  emitToUser(userId, 'notification:push', {
    id: notif._id,
    title: notif.title,
    message: notif.message,
    type: 'challenge',
    actionLink: notif.actionLink
  });

  emitSocketEvent('challenge:joined', {
    challengeId: challenge._id,
    title: challenge.title,
    participantsCount: challenge.participantsCount
  });

  return { challenge, userChallenge };
};

export const leaveChallenge = async (idOrSlug, userId) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const challenge = await Challenge.findOne({
    $or: [
      { _id: isObjectId ? idOrSlug : null },
      { slug: idOrSlug }
    ]
  });

  if (!challenge) {
    const error = new Error('Challenge not found');
    error.statusCode = 404;
    throw error;
  }

  const deleted = await UserChallenge.findOneAndDelete({
    userId,
    challengeId: challenge._id
  });

  if (!deleted) {
    const error = new Error('You are not currently enrolled in this challenge.');
    error.statusCode = 400;
    throw error;
  }

  challenge.participantsCount = Math.max(0, challenge.participantsCount - 1);
  await challenge.save();

  return { message: 'Successfully left the challenge.' };
};

export const createChallenge = async (challengeData, adminUserId) => {
  const slug = challengeData.slug || challengeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const challenge = await Challenge.create({
    ...challengeData,
    slug,
    createdBy: adminUserId,
    participantsCount: 0
  });

  emitSocketEvent('challenge:created', {
    id: challenge.slug || challenge._id,
    title: challenge.title,
    rewardPoints: challenge.rewardPoints
  });

  return challenge;
};

export const updateChallenge = async (idOrSlug, updateData) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const challenge = await Challenge.findOneAndUpdate(
    {
      $or: [
        { _id: isObjectId ? idOrSlug : null },
        { slug: idOrSlug }
      ]
    },
    updateData,
    { new: true, runValidators: true }
  );

  if (!challenge) {
    const error = new Error('Challenge not found');
    error.statusCode = 404;
    throw error;
  }

  return challenge;
};

export const deleteChallenge = async (idOrSlug) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const challenge = await Challenge.findOneAndDelete({
    $or: [
      { _id: isObjectId ? idOrSlug : null },
      { slug: idOrSlug }
    ]
  });

  if (!challenge) {
    const error = new Error('Challenge not found');
    error.statusCode = 404;
    throw error;
  }

  await UserChallenge.deleteMany({ challengeId: challenge._id });
  return { message: 'Challenge deleted successfully' };
};
