import { Router } from 'express';
import {
  getWebinars,
  getWebinarById,
  createWebinar,
  updateWebinar,
  deleteWebinar,
  registerWebinar
} from '../controllers/webinarController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getWebinars);
router.get('/:id', optionalAuth, getWebinarById);
router.post('/:id/register', authenticate, registerWebinar);

// Admin-only webinar management
router.post('/', authenticate, authorizeRoles('admin'), createWebinar);
router.put('/:id', authenticate, authorizeRoles('admin'), updateWebinar);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteWebinar);

export default router;
