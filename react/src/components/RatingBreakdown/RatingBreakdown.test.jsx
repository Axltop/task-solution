import { screen, within } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import RatingBreakdown from './RatingBreakdown';

describe('RatingBreakdown', () => {
  it('lists one bar per star level from highest to lowest', () => {
    renderWithTheme(<RatingBreakdown distribution={{ 5: 952, 4: 171, 3: 55, 2: 14, 1: 40 }} />);
    const list = screen.getByRole('list', { name: 'Rating breakdown' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(within(list).getAllByRole('progressbar').map((bar) => bar.getAttribute('aria-label'))).toEqual([
      '5 stars',
      '4 stars',
      '3 stars',
      '2 stars',
      '1 star',
    ]);
  });

  it('treats missing levels as zero reviews', () => {
    renderWithTheme(<RatingBreakdown distribution={{ 5: 3 }} />);
    expect(screen.getByRole('progressbar', { name: '5 stars' })).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByRole('progressbar', { name: '2 stars' })).toHaveAttribute('aria-valuenow', '0');
  });
});
