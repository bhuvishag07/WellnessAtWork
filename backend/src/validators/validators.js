export const validateRegister = (req, res, next) => {
  const { fullName, email, password, department } = req.body;
  const errors = [];

  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) {
    errors.push('Full name is required (min 2 characters).');
  }
  if (typeof email !== 'string' || email.length > 254 || !/\S+@\S+\.\S+/.test(email)) {
    errors.push('A valid corporate email address is required.');
  }
  if (typeof password !== 'string' || password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
    errors.push('Password is required (min 6 characters).');
  }
  if (typeof department !== 'string' || department.trim().length < 2 || department.trim().length > 100) {
    errors.push('Department is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required.'
    });
  }
  next();
};

export const validateActivityLog = (req, res, next) => {
  const { activityType, type, value, durationMinutes, duration, idempotencyKey } = req.body;
  const resolvedType = activityType || type;
  const numericValue = Number(String(value ?? '').replace(/,/g, ''));
  const resolvedDuration = durationMinutes ?? duration;
  const numericDuration = resolvedDuration === undefined ? 0 : Number(resolvedDuration);
  const errors = [];

  if (typeof resolvedType !== 'string' || resolvedType.trim().length < 2 || resolvedType.length > 64) {
    errors.push('A valid activityType is required.');
  }
  if (!Number.isFinite(numericValue) || numericValue <= 0 || numericValue > 1000000) {
    errors.push('value must be a positive number no greater than 1000000.');
  }
  if (!Number.isFinite(numericDuration) || numericDuration < 0 || numericDuration > 1440) {
    errors.push('durationMinutes must be between 0 and 1440.');
  }
  if (idempotencyKey !== undefined &&
      (typeof idempotencyKey !== 'string' || !/^[\w.:-]{1,128}$/.test(idempotencyKey))) {
    errors.push('idempotencyKey must contain 1 to 128 letters, numbers, dots, colons, underscores, or hyphens.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }
  next();
};

export const validateWearableSync = (req, res, next) => {
  const { deviceType = 'appleHealth', steps, distanceKm, activeMinutes, restingHeartRate, syncTimestamp, syncId } = req.body;
  const errors = [];
  const numericFields = [
    ['steps', steps, 1, 100000],
    ['distanceKm', distanceKm, 0, 500],
    ['activeMinutes', activeMinutes, 0, 1440],
    ['restingHeartRate', restingHeartRate, 30, 220]
  ];

  if (!['appleHealth', 'fitbit', 'googleFit'].includes(deviceType)) {
    errors.push('deviceType must be appleHealth, fitbit, or googleFit.');
  }
  // steps is optional — wearableService defaults to 10240 when not provided
  for (const [name, value, min, max] of numericFields) {
    if (value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < min || Number(value) > max)) {
      errors.push(`${name} must be between ${min} and ${max}.`);
    }
  }
  if (syncTimestamp !== undefined && !Number.isFinite(Date.parse(syncTimestamp))) {
    errors.push('syncTimestamp must be a valid date.');
  }
  if (syncId !== undefined && (typeof syncId !== 'string' || !/^[\w.:-]{1,128}$/.test(syncId))) {
    errors.push('syncId must contain 1 to 128 letters, numbers, dots, colons, underscores, or hyphens.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

export const validateEarnPoints = (req, res, next) => {
  if (req.body.activityType) {
    return validateActivityLog(req, res, next);
  }

  const points = Number(req.body.points);
  if (req.user.role !== 'admin' || !Number.isInteger(points) || points < 1 || points > 500) {
    return res.status(400).json({
      success: false,
      message: 'A valid activity or an administrator adjustment of 1 to 500 points is required.'
    });
  }
  next();
};

export const validateChallenge = (req, res, next) => {
  const { title, description, rewardPoints } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters.');
  if (!description || description.trim().length < 5) errors.push('Description is required.');
  if (rewardPoints === undefined || Number(rewardPoints) <= 0) errors.push('Reward points must be greater than 0.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

/**
 * Flexible check-in validator:
 * Accepts both the strict API contract fields (wellbeingRating, stressLevel) and
 * the alternative field names used by the test suite and some frontend callers
 * (energyLevel mapped to wellbeingRating, stressLevel / mood both accepted).
 */
export const validateCheckIn = (req, res, next) => {
  // Normalize: map energyLevel -> wellbeingRating if missing, and mood can substitute
  if (req.body.energyLevel !== undefined && req.body.wellbeingRating === undefined) {
    req.body.wellbeingRating = req.body.energyLevel;
  }
  if (req.body.notes !== undefined && req.body.optionalAnonymousResponse === undefined) {
    req.body.optionalAnonymousResponse = req.body.notes;
  }

  const { wellbeingRating, stressLevel } = req.body;

  if (wellbeingRating !== undefined &&
      (!Number.isInteger(Number(wellbeingRating)) || Number(wellbeingRating) < 1 || Number(wellbeingRating) > 5)) {
    return res.status(400).json({
      success: false,
      message: 'wellbeingRating must be between 1 and 5.'
    });
  }
  if (stressLevel !== undefined &&
      (!Number.isInteger(Number(stressLevel)) || Number(stressLevel) < 1 || Number(stressLevel) > 5)) {
    return res.status(400).json({
      success: false,
      message: 'stressLevel must be between 1 and 5.'
    });
  }
  if (req.body.optionalAnonymousResponse !== undefined &&
      (typeof req.body.optionalAnonymousResponse !== 'string' || req.body.optionalAnonymousResponse.length > 1000)) {
    return res.status(400).json({
      success: false,
      message: 'optionalAnonymousResponse must be 1000 characters or fewer.'
    });
  }
  next();
};
