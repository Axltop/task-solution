import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import Star from './Star';

describe('Star', () => {
  it('is fully filled by default', () => {
    renderWithTheme(<Star />);
    expect(screen.getByTestId('star-fill')).toHaveStyleRule('width', '100%');
  });

  it('draws the star in the theme surface colour', () => {
    renderWithTheme(<Star />);
    expect(screen.getByTestId('star-icon')).toHaveStyleRule('color', '#FFFFFF');
  });

  it('renders a partial fill', () => {
    renderWithTheme(<Star fill={0.6} />);
    expect(screen.getByTestId('star-fill')).toHaveStyleRule('width', '60%');
  });

  it.each([
    [-0.5, '0%'],
    [3, '100%'],
  ])('clamps a fill of %s to %s', (fill, width) => {
    renderWithTheme(<Star fill={fill} />);
    expect(screen.getByTestId('star-fill')).toHaveStyleRule('width', width);
  });
});
