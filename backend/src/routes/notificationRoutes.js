import { Router } from 'express';
import {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  sendNotification,
  deleteNotification
} from '../controllers/notificationController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.post('/send', authorizeRoles('admin'), sendNotification);
router.get('/:id', getNotificationById);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
