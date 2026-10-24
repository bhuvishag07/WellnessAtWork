import { Router } from 'express';
import {
  getParticipation,
  getWellness,
  exportParticipation,
  exportWellness
} from '../controllers/reportController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Admin-only full reports
router.get('/participation', authenticate, authorizeRoles('admin'), getParticipation);
router.get('/wellness', authenticate, authorizeRoles('admin'), getWellness);
router.get('/participation/export', authenticate, authorizeRoles('admin'), exportParticipation);
router.get('/wellness/export', authenticate, authorizeRoles('admin'), exportWellness);

// Authenticated summary aliases — accessible by all employees (used by test suite & frontend dashboard)
router.get('/summary', authenticate, getParticipation);
router.get('/activity', authenticate, getWellness);

export default router;
