import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { renderWithTheme } from '../../test-utils';
import ProductRating from './ProductRating';

const distribution = { 5: 952, 4: 171, 3: 55, 2: 14, 1: 40 };

describe('ProductRating', () => {
  it('renders the full widget as a region named by its heading', () => {
    renderWithTheme(<ProductRating distribution={distribution} average={4.6} />);
    expect(screen.getByRole('region', { name: 'Excellent' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByText('4.6 out of 5')).toBeInTheDocument();
    expect(screen.getByText('Product Rating')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(5);
  });

  it('computes the average from the distribution when none is given', () => {
    renderWithTheme(<ProductRating distribution={{ 5: 1, 4: 1, 3: 2 }} />);
    expect(screen.getByRole('img', { name: 'Rated 3.8 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Good' })).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ProductRating distribution={distribution} average={4.6} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('computes 4.6 from the design counts, as the demo does', () => {
    renderWithTheme(<ProductRating distribution={distribution} />);
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Excellent' })).toBeInTheDocument();
  });

  it('prefers an explicit average over the one computed from the distribution', () => {
    renderWithTheme(<ProductRating distribution={{ 5: 1 }} average={3.2} />);
    expect(screen.getByRole('img', { name: 'Rated 3.2 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Good' })).toBeInTheDocument();
  });

  it('rounds an explicit average to one decimal everywhere it is shown', () => {
    renderWithTheme(<ProductRating distribution={distribution} average={4.567} />);
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByText('4.6 out of 5')).toBeInTheDocument();
  });

  it('scales the label to maxRating', () => {
    renderWithTheme(<ProductRating distribution={{ 10: 1 }} average={4.6} maxRating={10} />);
    expect(screen.getByRole('heading', { name: 'Fair' })).toBeInTheDocument();
  });

  it('warns about a missing distribution but still renders an empty card', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderWithTheme(<ProductRating />);
    expect(spy.mock.calls.flat().join(' ')).toMatch(/`distribution` is marked as required/);
    spy.mockRestore();
    expect(screen.getByRole('heading', { name: 'Poor' })).toBeInTheDocument();
    screen.getAllByRole('progressbar').forEach((bar) => expect(bar).toHaveAttribute('aria-valuenow', '0'));
  });
});
