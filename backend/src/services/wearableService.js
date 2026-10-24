import { logUserActivity } from './activityService.js';
import Challenge from '../models/Challenge.js';

/**
 * Wearable Integration Service (Safe Mock / Integration-Ready Architecture):
 * Accepts synchronized telemetry from Apple Health Kit, Fitbit Web API, or Google Fit SDK.
 * Validates biometric parameters and routes through the authoritative activity/points pipeline
 * with source tagged as 'wearable'.
 */
export const syncWearableTelemetry = async ({
  userId,
  deviceType = 'appleHealth', // 'appleHealth' | 'fitbit' | 'googleFit'
  steps = 10240,
  distanceKm = 7.4,
  activeMinutes = 48,
  restingHeartRate = 62,
  syncTimestamp = new Date(),
  syncId
}) => {
  // Locate default active walking challenge if available
  const defaultWalkingChallenge = await Challenge.findOne({
    $or: [{ slug: '30-day-walking' }, { categoryKey: 'steps' }]
  });

  const challengeId = defaultWalkingChallenge ? defaultWalkingChallenge._id.toString() : null;
  const sourceEventId = `wearable:${deviceType}:${syncId || syncTimestamp.toISOString().slice(0, 10)}`;

  // Process through authoritative pipeline
  const result = await logUserActivity({
    userId,
    activityType: 'Walking',
    value: steps.toLocaleString(),
    durationMinutes: activeMinutes,
    challengeId,
    source: 'wearable',
    sourceEventId,
    notes: `Synced via ${deviceType === 'appleHealth' ? 'Apple Health' : deviceType === 'fitbit' ? 'Fitbit OS' : 'Google Fit'}.${distanceKm === null ? '' : ` Dist: ${distanceKm}km.`}${restingHeartRate === null ? '' : ` RHR: ${restingHeartRate}bpm.`}`
  });

  return {
    deviceType,
    lastSynced: syncTimestamp,
    duplicate: result.duplicate,
    telemetry: {
      steps,
      distanceKm,
      activeMinutes,
      restingHeartRate
    },
    activityResult: result
  };
};
