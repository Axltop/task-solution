import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import StarRating from './StarRating';

describe('StarRating', () => {
  it('exposes the rating as a single accessible image', () => {
    renderWithTheme(<StarRating value={4.6} />);
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
  });

  it('renders one tile per point with a partial last star', () => {
    renderWithTheme(<StarRating value={4.6} />);
    const fills = screen.getAllByTestId('star-fill');
    expect(fills).toHaveLength(5);
    fills.slice(0, 4).forEach((fill) => expect(fill).toHaveStyleRule('width', '100%'));
    expect(fills[4]).toHaveStyleRule('width', '60%');
  });

  it('supports a custom maximum', () => {
    renderWithTheme(<StarRating value={2} max={3} />);
    expect(screen.getAllByTestId('star')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Rated 2 out of 3 stars' })).toBeInTheDocument();
    expect(screen.getAllByTestId('star-fill')[2]).toHaveStyleRule('width', '0%');
  });
});
