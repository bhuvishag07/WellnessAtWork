import { Router } from 'express';
import { submitCheckIn, getCheckInSummary, getCheckInPublicStats } from '../controllers/checkInController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validateCheckIn } from '../validators/validators.js';

const router = Router();

// GET / — Anonymous aggregated wellness trends (authenticated users)
router.get('/', authenticate, getCheckInPublicStats);

// Anonymous check-in submission (can be submitted with or without session, identity is never retained)
router.post('/', (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticate(req, res, () => {
      validateCheckIn(req, res, next);
    });
  }
  validateCheckIn(req, res, next);
}, submitCheckIn);

// Admin-only aggregated summaries
router.get('/summary', authenticate, authorizeRoles('admin'), getCheckInSummary);

export default router;
