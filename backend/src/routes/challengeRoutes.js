import { Router } from 'express';
import {
  getChallenges,
  getChallenge,
  join,
  leave,
  create,
  update,
  remove
} from '../controllers/challengeController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validateChallenge } from '../validators/validators.js';

const router = Router();

// Public / optionally authenticated challenge viewing
router.get('/', (req, res, next) => {
  // Optional auth to attach user's enrollment status if logged in
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, getChallenges);

router.get('/:id', (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, getChallenge);

// Protected routes — both /join and /enroll are valid aliases
router.post('/:id/join', authenticate, join);
router.post('/:id/enroll', authenticate, join);   // alias for test suite compatibility
router.post('/:id/leave', authenticate, leave);

// Admin-only management
router.post('/', authenticate, authorizeRoles('admin'), validateChallenge, create);
router.put('/:id', authenticate, authorizeRoles('admin'), update);
router.delete('/:id', authenticate, authorizeRoles('admin'), remove);

export default router;
