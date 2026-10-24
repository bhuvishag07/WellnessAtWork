import { Router } from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  joinTeam
} from '../controllers/teamController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/', authenticate, createTeam);
router.post('/:id/join', authenticate, joinTeam);

export default router;
