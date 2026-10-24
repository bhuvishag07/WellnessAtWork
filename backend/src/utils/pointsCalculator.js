/**
 * Authoritative Server-Side Points Calculation Engine:
 * Case Study 72 Rule: Points must NOT be client-arbitrary.
 * Every activity has validated deterministic rules.
 */
export const calculateActivityPoints = ({ activityType, value, durationMinutes }) => {
  const normType = (activityType || '').toLowerCase().trim();
  const numericVal = parseFloat(String(value).replace(/,/g, '')) || 0;
  const duration = parseFloat(durationMinutes) || 0;

  if (normType.includes('walk') || normType.includes('step')) {
    // 10,000 steps => 100 points, minimum 10 points for tracked movement
    const steps = numericVal > 0 ? numericVal : duration * 100;
    return Math.max(10, Math.round(steps / 100));
  }

  if (normType.includes('meditat') || normType.includes('mindful')) {
    // 15 mins => 40 points (~2.5 pts per minute)
    const mins = duration > 0 ? duration : numericVal;
    return Math.max(15, Math.round(mins * 2.5));
  }

  if (normType.includes('exercis') || normType.includes('workout') || normType.includes('gym')) {
    // 30 mins => 60 points (~2 pts per minute)
    const mins = duration > 0 ? duration : numericVal;
    return Math.max(20, Math.round(mins * 2.0));
  }

  if (normType.includes('hydrat') || normType.includes('water')) {
    // Daily water goal log => 30 points
    return 30;
  }

  if (normType.includes('screen') || normType.includes('break')) {
    // 20-20-20 break => 20 points
    return 20;
  }

  if (normType.includes('yoga') || normType.includes('stretch')) {
    // Desk stretching => 40 points
    return 40;
  }

  // Default baseline for verified wellness activities
  return 50;
};

/**
 * Determine milestone bonuses achieved by progress updates
 */
export const checkMilestonesUnlocked = (challenge, previousProgress, currentProgress) => {
  if (!challenge || !challenge.milestones) return [];

  const unlocked = [];
  for (const milestone of challenge.milestones) {
    const milestoneTargetPercent = Math.round((milestone.day / challenge.totalDays) * 100);
    if (previousProgress < milestoneTargetPercent && currentProgress >= milestoneTargetPercent) {
      unlocked.push(milestone);
    }
  }
  return unlocked;
};
