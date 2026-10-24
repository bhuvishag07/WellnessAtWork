import { Router } from 'express';
import {
  getRewards,
  getRewardById,
  redeemReward,
  getRedemptionHistory,
  createReward,
  updateReward,
  deleteReward
} from '../controllers/rewardController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getRewards);
router.get('/history', authenticate, getRedemptionHistory);
router.get('/:id', optionalAuth, getRewardById);
router.post('/redeem', authenticate, redeemReward);

// Admin-only reward catalog management
router.post('/', authenticate, authorizeRoles('admin'), createReward);
router.put('/:id', authenticate, authorizeRoles('admin'), updateReward);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteReward);

export default router;
