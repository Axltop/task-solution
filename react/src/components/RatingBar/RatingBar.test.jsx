import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import RatingBar from './RatingBar';

const renderBar = (props) =>
  renderWithTheme(
    <ul>
      <RatingBar {...props} />
    </ul>,
  );

describe('RatingBar', () => {
  it('exposes the share of reviews as a labelled progressbar', () => {
    renderBar({ stars: 5, count: 952, total: 1232 });
    const bar = screen.getByRole('progressbar', { name: '5 stars' });
    expect(bar).toHaveAttribute('aria-valuenow', '77');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '952 reviews (77%)');
  });

  it('shows the star label and review count visually', () => {
    renderBar({ stars: 5, count: 952, total: 1232 });
    expect(screen.getByText('952')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('gives the star digit a fixed width so the stars line up across rows', () => {
    renderBar({ stars: 1, count: 40, total: 1232 });
    const digit = screen.getByText('1');
    expect(digit).toHaveStyleRule('min-width', '1ch');
    expect(digit).toHaveStyleRule('font-variant-numeric', 'tabular-nums');
  });

  it('sizes the fill by the share of reviews', () => {
    renderBar({ stars: 4, count: 1, total: 4 });
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('width', '25%');
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('min-width', '3px');
  });

  it('uses singular wording for one star and one review', () => {
    renderBar({ stars: 1, count: 1, total: 10 });
    const bar = screen.getByRole('progressbar', { name: '1 star' });
    expect(bar).toHaveAttribute('aria-valuetext', '1 review (10%)');
  });

  it('renders an empty bar when there are no reviews', () => {
    renderBar({ stars: 3, count: 0, total: 0 });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('width', '0%');
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('min-width', '0');
  });
});
