export const RATING_LABELS = [
  { min: 4.5, label: 'Excellent' },
  { min: 4, label: 'Very good' },
  { min: 3, label: 'Good' },
  { min: 2, label: 'Fair' },
  { min: 0, label: 'Poor' },
];

export const getTotal = (distribution) =>
  Object.values(distribution).reduce((sum, count) => sum + count, 0);

export const getAverage = (distribution) => {
  const total = getTotal(distribution);
  if (total === 0) return 0;
  const weighted = Object.entries(distribution).reduce(
    (sum, [stars, count]) => sum + Number(stars) * count,
    0,
  );
  return Math.round((weighted / total) * 10) / 10;
};

export const getLabel = (average) =>
  RATING_LABELS.find(({ min }) => average >= min).label;

export const getPercent = (count, total) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
