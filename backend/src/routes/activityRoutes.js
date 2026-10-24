import { Router } from 'express';
import {
  logActivity,
  getActivities,
  getActivityById,
  getUserActivities
} from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';
import { validateActivityLog } from '../validators/validators.js';

const router = Router();

router.use(authenticate);

router.post('/', validateActivityLog, logActivity);
router.post('/log', validateActivityLog, logActivity);
router.get('/', getActivities);
router.get('/user/:id', getUserActivities);
router.get('/:id', getActivityById);

export default router;
