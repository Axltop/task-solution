import { clamp, getAverage, getLabel, getPercent, getTotal } from './rating';

const distribution = { 5: 952, 4: 171, 3: 55, 2: 14, 1: 40 };

describe('rating utils', () => {
  it('sums the review counts', () => {
    expect(getTotal(distribution)).toBe(1232);
    expect(getTotal({})).toBe(0);
  });

  it('computes a weighted average rounded to one decimal', () => {
    expect(getAverage(distribution)).toBe(4.6);
    expect(getAverage({ 5: 1, 4: 1 })).toBe(4.5);
    expect(getAverage({ 5: 0, 1: 0 })).toBe(0);
  });

  it.each([
    [5, 'Excellent'],
    [4.5, 'Excellent'],
    [4.4, 'Very good'],
    [3, 'Good'],
    [2.9, 'Fair'],
    [1.9, 'Poor'],
    [0, 'Poor'],
  ])('labels %s as %s', (average, label) => {
    expect(getLabel(average)).toBe(label);
  });

  it('computes a rounded percentage and guards against zero totals', () => {
    expect(getPercent(952, 1232)).toBe(77);
    expect(getPercent(0, 1232)).toBe(0);
    expect(getPercent(5, 0)).toBe(0);
  });

  it('clamps values into a range', () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.6, 0, 1)).toBe(0.6);
    expect(clamp(2, 0, 1)).toBe(1);
  });
});
