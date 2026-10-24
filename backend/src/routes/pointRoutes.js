import { Router } from 'express';
import {
  getPoints,
  getPointsHistory,
  getUserPoints,
  earnPoints
} from '../controllers/pointController.js';
import { authenticate } from '../middleware/auth.js';
import { validateEarnPoints } from '../validators/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', getPoints);
router.get('/balance', getPoints);   // alias: test suite and frontend both use /points/balance
router.get('/history', getPointsHistory);
router.get('/user/:id', getUserPoints);
router.post('/earn', validateEarnPoints, earnPoints);

export default router;
