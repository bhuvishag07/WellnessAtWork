import { Router } from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} from '../controllers/resourceController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getResources);
router.get('/:id', getResourceById);

// Admin-only operations
router.post('/', authenticate, authorizeRoles('admin'), createResource);
router.put('/:id', authenticate, authorizeRoles('admin'), updateResource);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteResource);

export default router;
