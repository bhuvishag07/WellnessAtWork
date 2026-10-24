import { Router } from 'express';
import { register, login, logout, getMe, firebaseLogin } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../validators/validators.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/firebase', firebaseLogin);

export default router;
