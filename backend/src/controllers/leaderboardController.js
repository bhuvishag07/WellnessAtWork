import User from '../models/User.js';
import UserChallenge from '../models/UserChallenge.js';
import Challenge from '../models/Challenge.js';
import ActivityLog from '../models/ActivityLog.js';
import Team from '../models/Team.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const { department, search } = req.query;
    const query = { role: 'employee' };

    if (department && department !== 'All') {
      query.department = { $regex: new RegExp(department, 'i') };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { fullName: { $regex: new RegExp(search.trim(), 'i') } },
        { department: { $regex: new RegExp(search.trim(), 'i') } }
      ];
    }

    const employees = await User.find(query).limit(100);

    const userIds = employees.map(emp => emp._id);
    const activityTotals = await ActivityLog.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: '$userId',
          totalActivityPoints: { $sum: '$pointsEarned' },
          activityCount: { $sum: 1 },
          lastActive: { $max: '$timestamp' }
        }
      }
    ]);
    const activityMap = new Map(activityTotals.map(item => [item._id.toString(), item]));

    const currentUserId = req.user ? req.user._id.toString() : null;

    const overall = employees.map((emp) => {
      const isCurrentUser = currentUserId === emp._id.toString();
      const hideName = emp.privacySettings?.leaderboardVisibility === false && !isCurrentUser;
      const activity = activityMap.get(emp._id.toString());
      const points = Math.max(emp.totalPoints || 0, activity?.totalActivityPoints || 0);

      return {
        id: emp._id.toString(),
        name: hideName ? 'Anonymous Colleague' : emp.fullName,
        department: emp.department,
        points,
        activityCount: activity?.activityCount || 0,
        progress: Math.min(100, Math.round((points / 1500) * 100)),
        streak: emp.streakDays,
        badge: emp.tier,
        avatar: emp.avatar,
        isCurrentUser,
        createdAt: emp.createdAt
      };
    })
    .sort((a, b) => b.points - a.points || new Date(a.createdAt) - new Date(b.createdAt))
    .map((emp, index) => {
      const { createdAt, ...rest } = emp;
      return {
        rank: index + 1,
        ...rest
      };
    });

    return successResponse(res, {
      message: 'Leaderboard fetched successfully',
      data: { overall }
    });
  } catch (error) {
    next(error);
  }
};

export const getChallengeLeaderboard = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const challenge = await Challenge.findOne({
      $or: [
        { _id: isObjectId ? req.params.id : null },
        { slug: req.params.id }
      ]
    });

    if (!challenge) {
      return errorResponse(res, { statusCode: 404, message: 'Challenge not found' });
    }

    const enrollments = await UserChallenge.find({ challengeId: challenge._id })
      .populate('userId', 'fullName department avatar tier streakDays privacySettings')
      .sort({ currentProgress: -1, lastLoggedAt: -1 })
      .limit(50);

    const currentUserId = req.user ? req.user._id.toString() : null;
    const enrolledUserIds = enrollments.filter(e => e.userId).map(e => e.userId._id);
    const activityTotals = await ActivityLog.aggregate([
      {
        $match: {
          challengeId: challenge._id,
          userId: { $in: enrolledUserIds }
        }
      },
      {
        $group: {
          _id: '$userId',
          points: { $sum: '$pointsEarned' },
          activityValue: { $sum: '$numericValue' },
          activityCount: { $sum: 1 }
        }
      }
    ]);
    const totalsByUserId = new Map(
      activityTotals.map(item => [item._id.toString(), item])
    );

    const challengeLeaderboard = enrollments
      .filter(e => e.userId)
      .map((e, index) => {
        const emp = e.userId;
        const isCurrentUser = currentUserId === emp._id.toString();
        const hideName = emp.privacySettings?.leaderboardVisibility === false && !isCurrentUser;
        const totals = totalsByUserId.get(emp._id.toString());

        return {
          rank: index + 1,
          id: emp._id.toString(),
          name: hideName ? 'Anonymous Colleague' : isCurrentUser ? `${emp.fullName} (You)` : emp.fullName,
          department: emp.department,
          progress: e.currentProgress,
          points: totals?.points ?? 0,
          activityValue: totals?.activityValue ?? 0,
          activityCount: totals?.activityCount ?? 0,
          streak: emp.streakDays,
          badge: emp.tier,
          avatar: emp.avatar,
          isCurrentUser
        };
      });

    return successResponse(res, {
      message: 'Challenge leaderboard fetched',
      data: {
        challengeId: challenge._id,
        challengeTitle: challenge.title,
        leaderboard: challengeLeaderboard
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamLeaderboard = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('members.userId', 'fullName avatar')
      .sort({ totalPoints: -1 })
      .limit(30);

    const teamLeaderboard = teams.map((t, index) => ({
      rank: index + 1,
      id: t._id.toString(),
      name: t.name,
      department: t.department,
      totalPoints: t.totalPoints,
      membersCount: t.members.length,
      leadName: t.members.length > 0 && t.members[0].userId ? t.members[0].userId.fullName : 'Team Lead'
    }));

    return successResponse(res, {
      message: 'Team leaderboard fetched',
      data: { teams: teamLeaderboard }
    });
  } catch (error) {
    next(error);
  }
};
export const getDepartmentLeaderboard = async (req, res, next) => {
  try {
    const departmentStats = await User.aggregate([
      { $match: { role: 'employee' } },
      {
        $group: {
          _id: '$department',
          totalPoints: { $sum: '$totalPoints' },
          memberCount: { $sum: 1 },
          avgPoints: { $avg: '$totalPoints' }
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    const departments = departmentStats.map((d, idx) => ({
      rank: idx + 1,
      department: d._id || 'General',
      totalPoints: d.totalPoints,
      memberCount: d.memberCount,
      avgPoints: Math.round(d.avgPoints)
    }));

    return successResponse(res, {
      message: 'Department leaderboard fetched successfully',
      data: { departments }
    });
  } catch (error) {
    next(error);
  }
};
