import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import challengeRoutes from './challengeRoutes.js';
import activityRoutes from './activityRoutes.js';
import pointRoutes from './pointRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import rewardRoutes from './rewardRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import teamRoutes from './teamRoutes.js';
import webinarRoutes from './webinarRoutes.js';
import checkInRoutes from './checkInRoutes.js';
import wearableRoutes from './wearableRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/challenges', challengeRoutes);
router.use('/activities', activityRoutes);
router.use('/points', pointRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/sessions', sessionRoutes);
router.use('/resources', resourceRoutes);
router.use('/rewards', rewardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/teams', teamRoutes);
router.use('/webinars', webinarRoutes);
router.use('/check-ins', checkInRoutes);
router.use('/wearable', wearableRoutes);
router.use('/reports', reportRoutes);

/**
 * Health check — always HTTP 200.
 * A health check verifies the *process* is alive and reachable.
 * DB status is reported as a field so monitors can distinguish
 * "server OK, DB degraded" from "server down".
 *   mongoose readyState: 0=disconnected 1=connected 2=connecting 3=disconnecting
 */
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }[dbState] ?? 'unknown';

  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    service: 'WellnessAtWork Backend (Case Study 72)',
    version: '1.0.0',
    database: dbStatus,
    uptime: Math.round(process.uptime())
  });
});

export default router;
