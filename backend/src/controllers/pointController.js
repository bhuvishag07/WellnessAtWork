import PointTransaction from '../models/PointTransaction.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logUserActivity } from '../services/activityService.js';

export const getPoints = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, {
      message: 'Points balance fetched',
      data: {
        totalPoints: user.totalPoints,
        tier: user.tier,
        streakDays: user.streakDays
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPointsHistory = async (req, res, next) => {
  try {
    const history = await PointTransaction.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    return successResponse(res, {
      message: 'Points ledger fetched',
      data: { history }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPoints = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, { statusCode: 403, message: 'You cannot view another user’s points.' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, { statusCode: 404, message: 'User not found' });
    }

    return successResponse(res, {
      message: 'User points fetched',
      data: {
        userId: user._id,
        totalPoints: user.totalPoints,
        tier: user.tier
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validated Point Award Endpoint:
 * Prevents arbitrary injection of points.
 * Must specify valid rule-based reason or requires admin authorization for bonuses.
 */
export const earnPoints = async (req, res, next) => {
  try {
    const { activityType, value, durationMinutes, reason } = req.body;

    let pointsToCredit = 0;
    let description = reason || 'Wellness achievement';

    if (activityType) {
      const result = await logUserActivity({
        userId: req.user._id,
        activityType,
        value,
        durationMinutes,
        source: 'manual',
        sourceEventId: req.body.idempotencyKey || null,
        notes: reason || ''
      });
      return successResponse(res, {
        statusCode: result.duplicate ? 200 : 201,
        message: result.duplicate ? 'Activity was already processed' : 'Activity logged and points awarded',
        data: result
      });
    } else if (req.user.role === 'admin' && req.body.points) {
      // Admin adjustment
      pointsToCredit = Number(req.body.points);
      description = `Administrative bonus: ${reason || 'Corporate award'}`;
    } else {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Invalid earn request. Points must be earned through verified activity modalities or authorized awards.'
      });
    }

    const user = await User.findById(req.user._id);
    user.totalPoints += pointsToCredit;
    user.updateTier();
    await user.save();

    const transaction = await PointTransaction.create({
      userId: user._id,
      type: 'earned',
      points: pointsToCredit,
      source: req.user.role === 'admin' ? 'admin_adjustment' : 'activity',
      description,
      balanceAfter: user.totalPoints
    });

    return successResponse(res, {
      message: `Successfully credited ${pointsToCredit} points`,
      data: {
        pointsEarned: pointsToCredit,
        totalPoints: user.totalPoints,
        transaction
      }
    });
  } catch (error) {
    next(error);
  }
};
