import {
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  leaveChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge
} from '../services/challengeService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getChallenges = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const challenges = await getAllChallenges(userId);
    return successResponse(res, {
      message: 'Challenges retrieved successfully',
      data: { challenges }
    });
  } catch (error) {
    next(error);
  }
};

export const getChallenge = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const challenge = await getChallengeById(req.params.id, userId);
    return successResponse(res, {
      message: 'Challenge retrieved successfully',
      data: { challenge }
    });
  } catch (error) {
    next(error);
  }
};

export const join = async (req, res, next) => {
  try {
    const { teamId } = req.body;
    const result = await joinChallenge(req.params.id, req.user._id, teamId);
    return successResponse(res, {
      message: 'Successfully enrolled in challenge',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const leave = async (req, res, next) => {
  try {
    const result = await leaveChallenge(req.params.id, req.user._id);
    return successResponse(res, {
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const challenge = await createChallenge(req.body, req.user._id);
    return successResponse(res, {
      statusCode: 201,
      message: 'Challenge created successfully',
      data: { challenge }
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const challenge = await updateChallenge(req.params.id, req.body);
    return successResponse(res, {
      message: 'Challenge updated successfully',
      data: { challenge }
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteChallenge(req.params.id);
    return successResponse(res, {
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
