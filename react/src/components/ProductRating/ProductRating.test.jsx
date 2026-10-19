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

  it('warns when the required distribution prop is missing', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithTheme(<ProductRating average={4} />)).toThrow();
    expect(spy.mock.calls.flat().join(' ')).toMatch(/`distribution` is marked as required/);
    spy.mockRestore();
  });
});
