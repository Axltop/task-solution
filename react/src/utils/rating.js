/* Thresholds are shares of the maximum rating, so they work for any scale (4.5 / 5 = 0.9). */
export const RATING_LABELS = [
  { min: 0.9, label: 'Excellent' },
  { min: 0.8, label: 'Very good' },
  { min: 0.6, label: 'Good' },
  { min: 0.4, label: 'Fair' },
];

export const LOWEST_LABEL = 'Poor';

export const roundToOneDecimal = (value) => Math.round(value * 10) / 10;

export const getTotal = (distribution = {}) =>
  Object.values(distribution).reduce((sum, count) => sum + count, 0);

export const getAverage = (distribution = {}) => {
  const total = getTotal(distribution);
  if (total === 0) return 0;
  const weighted = Object.entries(distribution).reduce(
    (sum, [stars, count]) => sum + Number(stars) * count,
    0,
  );
  return roundToOneDecimal(weighted / total);
};

/* Anything below the lowest threshold, including NaN or a negative score, is the lowest label. */
export const getLabel = (average, maxRating = 5) =>
  RATING_LABELS.find(({ min }) => average / maxRating >= min)?.label ?? LOWEST_LABEL;

export const getPercent = (count, total) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
