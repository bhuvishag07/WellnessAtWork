import Reward from '../models/Reward.js';
import RewardLedger from '../models/RewardLedger.js';
import User from '../models/User.js';
import PointTransaction from '../models/PointTransaction.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { emitSocketEvent, emitToUser } from '../sockets/socketHandler.js';

export const getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({ active: true }).sort({ pointsCost: 1 });
    const userPoints = req.user ? req.user.totalPoints : 0;

    const formatted = rewards.map(r => {
      const json = r.toJSON();
      const hasEnough = userPoints >= r.pointsCost;
      json.status = hasEnough ? 'available' : 'locked';
      json.neededPoints = Math.max(0, r.pointsCost - userPoints);
      return json;
    });

    return successResponse(res, {
      message: 'Rewards fetched successfully',
      data: { rewards: formatted }
    });
  } catch (error) {
    next(error);
  }
};

export const getRewardById = async (req, res, next) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return errorResponse(res, { statusCode: 404, message: 'Reward not found' });
    }
    return successResponse(res, {
      message: 'Reward retrieved',
      data: { reward }
    });
  } catch (error) {
    next(error);
  }
};

export const redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.body;
    if (!rewardId) {
      return errorResponse(res, { statusCode: 400, message: 'rewardId is required' });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.active) {
      return errorResponse(res, { statusCode: 404, message: 'Reward not found or inactive' });
    }

    const user = await User.findById(req.user._id);

    // Verify sufficient points
    if (user.totalPoints < reward.pointsCost) {
      return errorResponse(res, {
        statusCode: 400,
        message: `Insufficient points. You need ${reward.pointsCost - user.totalPoints} more points to claim this reward.`
      });
    }

    // Atomic point deduction (prevent negative balance)
    user.totalPoints -= reward.pointsCost;
    user.updateTier();
    await user.save();

    // Generate unique claim voucher code
    const uniqueCode = `WAW-${reward.category.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const ledger = await RewardLedger.create({
      userId: user._id,
      rewardId: reward._id,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsCost,
      code: uniqueCode,
      status: 'claimed',
      redemptionDate: new Date()
    });

    // Record point transaction
    await PointTransaction.create({
      userId: user._id,
      type: 'spent',
      points: reward.pointsCost,
      source: 'reward_redemption',
      description: `Redeemed "${reward.title}" (Voucher: ${uniqueCode})`,
      balanceAfter: user.totalPoints,
      relatedReward: reward._id
    });

    // Send internal notification
    const notif = await Notification.create({
      recipient: user._id,
      title: `Reward Claimed: ${reward.title} 🎉`,
      message: `Spent ${reward.pointsCost} points. Remaining balance: ${user.totalPoints} points. Code: ${uniqueCode}`,
      type: 'reward',
      actionLink: '/rewards'
    });

    emitToUser(user._id, 'notification:push', {
      id: notif._id,
      title: notif.title,
      message: notif.message,
      type: 'reward',
      actionLink: notif.actionLink
    });

    emitSocketEvent('reward:redeemed', {
      title: 'Reward Redeemed',
      user: user.fullName,
      rewardTitle: reward.title
    });

    return successResponse(res, {
      message: `Successfully claimed "${reward.title}"!`,
      data: {
        redemption: ledger,
        voucherCode: uniqueCode,
        remainingPoints: user.totalPoints,
        reward
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRedemptionHistory = async (req, res, next) => {
  try {
    const history = await RewardLedger.find({ userId: req.user._id })
      .populate('rewardId')
      .sort({ redemptionDate: -1 });

    return successResponse(res, {
      message: 'Redemption history fetched',
      data: { history }
    });
  } catch (error) {
    next(error);
  }
};

export const createReward = async (req, res, next) => {
  try {
    const reward = await Reward.create(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Reward created successfully',
      data: { reward }
    });
  } catch (error) {
    next(error);
  }
};

export const updateReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!reward) {
      return errorResponse(res, { statusCode: 404, message: 'Reward not found' });
    }
    return successResponse(res, {
      message: 'Reward updated successfully',
      data: { reward }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return errorResponse(res, { statusCode: 404, message: 'Reward not found' });
    }
    return successResponse(res, {
      message: 'Reward deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
