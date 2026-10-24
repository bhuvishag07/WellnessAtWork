import { Router } from 'express';
import {
  getSessions,
  getSessionById,
  bookSession,
  cancelSession,
  getUserSessions,
  createSession
} from '../controllers/sessionController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getSessions);
router.get('/:id', optionalAuth, getSessionById);

// Protected actions
router.post('/', authenticate, bookSession);
router.post('/book', authenticate, bookSession);
router.delete('/:id', authenticate, cancelSession);
router.get('/user/:id', authenticate, getUserSessions);

// Admin-only session creation
router.post('/create', authenticate, authorizeRoles('admin'), createSession);

export default router;
