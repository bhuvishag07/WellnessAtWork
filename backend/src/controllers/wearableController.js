import { syncWearableTelemetry } from '../services/wearableService.js';
import { successResponse } from '../utils/apiResponse.js';

export const syncTelemetry = async (req, res, next) => {
  try {
    const { deviceType, steps, distanceKm, activeMinutes, restingHeartRate, syncTimestamp, syncId } = req.body;

    const result = await syncWearableTelemetry({
      userId: req.user._id,
      deviceType: deviceType || 'appleHealth',
      steps: Number(steps),
      distanceKm: distanceKm === undefined ? null : Number(distanceKm),
      activeMinutes: activeMinutes === undefined ? 0 : Number(activeMinutes),
      restingHeartRate: restingHeartRate === undefined ? null : Number(restingHeartRate),
      syncTimestamp: syncTimestamp ? new Date(syncTimestamp) : new Date(),
      syncId
    });

    return successResponse(res, {
      statusCode: result.activityResult.duplicate ? 200 : 201,
      message: `${deviceType === 'fitbit' ? 'Fitbit OS' : deviceType === 'googleFit' ? 'Google Fit' : 'Apple Health'} synchronized successfully`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getStatus = async (req, res) => {
  return successResponse(res, {
    message: 'Wearable integration status',
    data: {
      appleHealthConnected: true,
      fitbitConnected: false,
      googleFitConnected: false,
      lastSyncTime: new Date(),
      integrationMode: 'Integration-Ready Biometric Telemetry Simulator (Academic Architecture)'
    }
  });
};
