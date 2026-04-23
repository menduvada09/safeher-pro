export function calculateSafetyScore({ hour, speed, hasLocation, isTracking, contactCount }) {
  let score = 84;
  if (!hasLocation) score -= 22;
  if (hour >= 21 || hour <= 5) score -= 18;
  if (speed > 18) score -= 8;
  if (contactCount === 0) score -= 16;
  if (!isTracking) score -= 8;
  score = Math.max(0, Math.min(100, score));
  const label = score >= 75 ? 'Safe' : score >= 45 ? 'Caution' : 'Risky';
  return { score, label };
}
