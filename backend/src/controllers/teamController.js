import Team from '../models/Team.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().populate('members.userId', 'fullName avatar department');
    return successResponse(res, {
      message: 'Teams fetched',
      data: { teams }
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('members.userId', 'fullName avatar department totalPoints');
    if (!team) {
      return errorResponse(res, { statusCode: 404, message: 'Team not found' });
    }
    return successResponse(res, {
      message: 'Team fetched',
      data: { team }
    });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const { name, department, description } = req.body;
    const team = await Team.create({
      name,
      department: department || req.user.department,
      description: description || '',
      members: [{ userId: req.user._id, role: 'leader' }]
    });

    return successResponse(res, {
      statusCode: 201,
      message: 'Team created successfully',
      data: { team }
    });
  } catch (error) {
    next(error);
  }
};

export const joinTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return errorResponse(res, { statusCode: 404, message: 'Team not found' });
    }

    const isMember = team.members.some(m => m.userId.toString() === req.user._id.toString());
    if (isMember) {
      return errorResponse(res, { statusCode: 400, message: 'Already a member of this team' });
    }

    team.members.push({ userId: req.user._id, role: 'member' });
    await team.save();

    return successResponse(res, {
      message: `Successfully joined ${team.name}`,
      data: { team }
    });
  } catch (error) {
    next(error);
  }
};
