import { Router } from 'express';
import { syncTelemetry, getStatus } from '../controllers/wearableController.js';
import { authenticate } from '../middleware/auth.js';
import { validateWearableSync } from '../validators/validators.js';

const router = Router();

router.use(authenticate);

router.post('/sync', validateWearableSync, syncTelemetry);
router.get('/status', getStatus);

export default router;
