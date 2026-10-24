import { Router } from 'express';
import {
  getLeaderboard,
  getChallengeLeaderboard,
  getTeamLeaderboard,
  getDepartmentLeaderboard
} from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Optional authentication to identify current user
const optionalAuth = (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getLeaderboard);
router.get('/departments', optionalAuth, getDepartmentLeaderboard);
router.get('/challenge/:id', optionalAuth, getChallengeLeaderboard);
router.get('/team/:id', optionalAuth, getTeamLeaderboard);

export default router;
