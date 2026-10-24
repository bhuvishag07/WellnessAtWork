import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import { logUserActivity } from '../services/activityService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const logActivity = async (req, res, next) => {
  try {
    const { activityType, type, value, duration, durationMinutes, challengeId, idempotencyKey, notes } = req.body;

    const resolvedType = activityType || type;
    const resolvedDuration = durationMinutes !== undefined ? durationMinutes : duration;

    if (!resolvedType || value === undefined) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'activityType and value are required'
      });
    }

    const result = await logUserActivity({
      userId: req.user._id,
      activityType: resolvedType,
      value,
      durationMinutes: resolvedDuration,
      challengeId,
      source: 'manual',
      sourceEventId: idempotencyKey || null,
      notes: notes || ''
    });

    return successResponse(res, {
      statusCode: result.duplicate ? 200 : 201,
      message: result.duplicate ? 'Activity was already processed' : 'Activity logged successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const activities = await ActivityLog.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments({ userId: req.user._id });

    return successResponse(res, {
      message: 'Activities fetched successfully',
      data: { activities, total, page, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const activity = await ActivityLog.findById(req.params.id);
    if (!activity) {
      return errorResponse(res, { statusCode: 404, message: 'Activity not found' });
    }

    // Confidentiality check: users can only see their own activity unless admin
    if (activity.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, { statusCode: 403, message: 'Unauthorized to view this activity' });
    }

    return successResponse(res, {
      message: 'Activity retrieved successfully',
      data: { activity }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserActivities = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    if (targetUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, { statusCode: 403, message: 'You cannot view another user’s activity history.' });
    }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, { statusCode: 404, message: 'User not found' });
    }
    const activities = await ActivityLog.find({ userId: targetUserId })
      .sort({ timestamp: -1 })
      .limit(20);

    return successResponse(res, {
      message: 'User activities retrieved',
      data: { activities }
    });
  } catch (error) {
    next(error);
  }
};
