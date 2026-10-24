import MentalHealthCheckIn from '../models/MentalHealthCheckIn.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Anonymous Check-In Controller:
 * Strict Privacy Architecture:
 * Submissions explicitly DO NOT link to req.user._id, protecting employee privacy.
 */
export const submitCheckIn = async (req, res, next) => {
  try {
    // Normalize alternative field names sent by test suite and older clients:
    // energyLevel → wellbeingRating, notes → optionalAnonymousResponse
    const rawWellbeing = req.body.wellbeingRating ?? req.body.energyLevel ?? 3;
    const rawStress    = req.body.stressLevel ?? 3;
    const rawNote      = req.body.optionalAnonymousResponse ?? req.body.notes ?? '';
    const { department } = req.body;

    const wellbeingRating = Math.min(5, Math.max(1, Number(rawWellbeing)));
    const stressLevel     = Math.min(5, Math.max(1, Number(rawStress)));

    let sentimentCategory = 'balanced';
    if (wellbeingRating >= 4 && stressLevel <= 2) sentimentCategory = 'thriving';
    else if (wellbeingRating <= 2 || stressLevel >= 4) sentimentCategory = 'at_risk';
    else if (stressLevel >= 3) sentimentCategory = 'fatigued';

    const checkIn = await MentalHealthCheckIn.create({
      wellbeingRating,
      stressLevel,
      sentimentCategory,
      optionalAnonymousResponse: rawNote ? String(rawNote).trim() : '',
      departmentAggregateTag: department || (req.user ? req.user.department : 'General')
    });

    return successResponse(res, {
      statusCode: 201,
      message: 'Anonymous wellness check-in recorded. Thank you for checking in.',
      data: {
        sentimentCategory,
        timestamp: checkIn.timestamp,
        privacyNotice: '100% Anonymous. No identity records retained.'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public-facing anonymous wellness stats for regular employees.
 * Returns only aggregated, anonymized data — no individual records.
 */
export const getCheckInPublicStats = async (req, res, next) => {
  try {
    const totalSubmissions = await MentalHealthCheckIn.countDocuments();

    const averages = await MentalHealthCheckIn.aggregate([
      {
        $group: {
          _id: null,
          avgWellbeing: { $avg: '$wellbeingRating' },
          avgStress: { $avg: '$stressLevel' }
        }
      }
    ]);

    const sentimentDistribution = await MentalHealthCheckIn.aggregate([
      {
        $group: {
          _id: '$sentimentCategory',
          count: { $sum: 1 }
        }
      }
    ]);

    return successResponse(res, {
      message: 'Anonymous wellness check-in trends',
      data: {
        totalSubmissions,
        overallAvgWellbeing: averages[0] ? Number(averages[0].avgWellbeing.toFixed(2)) : 0,
        overallAvgStress: averages[0] ? Number(averages[0].avgStress.toFixed(2)) : 0,
        distribution: sentimentDistribution.map(d => ({ category: d._id, count: d.count })),
        privacyNotice: 'All responses are strictly anonymous. No individual data is ever accessible.'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregated Check-In Summary for HR Administration:
 * Aggregates statistics without ever revealing individual submissions.
 */
export const getCheckInSummary = async (req, res, next) => {
  try {
    const totalSubmissions = await MentalHealthCheckIn.countDocuments();

    const averages = await MentalHealthCheckIn.aggregate([
      {
        $group: {
          _id: null,
          avgWellbeing: { $avg: '$wellbeingRating' },
          avgStress: { $avg: '$stressLevel' }
        }
      }
    ]);

    const sentimentDistribution = await MentalHealthCheckIn.aggregate([
      {
        $group: {
          _id: '$sentimentCategory',
          count: { $sum: 1 }
        }
      }
    ]);

    return successResponse(res, {
      message: 'Aggregated anonymized check-in summary',
      data: {
        totalSubmissions,
        overallAvgWellbeing: averages[0] ? Number(averages[0].avgWellbeing.toFixed(2)) : 0,
        overallAvgStress: averages[0] ? Number(averages[0].avgStress.toFixed(2)) : 0,
        distribution: sentimentDistribution.map(d => ({ category: d._id, count: d.count })),
        confidentialityFirewall: 'Individual responses are strictly isolated from HR views.'
      }
    });
  } catch (error) {
    next(error);
  }
};
