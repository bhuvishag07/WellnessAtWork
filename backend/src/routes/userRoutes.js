import { Router } from 'express';
import {
  getDashboard,
  updateProfile,
  updateAvatar,
  updatePrivacy,
  updateNotifications,
  updatePassword
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/profile', getDashboard);   // alias: GET /user/profile returns dashboard user data
router.put('/profile', updateProfile);
router.put('/avatar', updateAvatar);
router.put('/privacy', updatePrivacy);
router.put('/notifications', updateNotifications);
router.put('/password', updatePassword);

export default router;
