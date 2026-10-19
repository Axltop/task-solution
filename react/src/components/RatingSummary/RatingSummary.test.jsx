import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import RatingSummary from './RatingSummary';

describe('RatingSummary', () => {
  beforeEach(() => {
    renderWithTheme(<RatingSummary headingId="summary" label="Excellent" average={4.6} />);
  });

  it('renders the label as a heading', () => {
    const heading = screen.getByRole('heading', { level: 2, name: 'Excellent' });
    expect(heading).toHaveAttribute('id', 'summary');
  });

  it('renders the star rating', () => {
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
  });

  it('shows the score text without announcing it twice', () => {
    const score = screen.getByText('4.6 out of 5');
    expect(score).toHaveAttribute('aria-hidden', 'true');
  });
});
