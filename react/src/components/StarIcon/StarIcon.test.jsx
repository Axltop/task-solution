import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import StarIcon from './StarIcon';

describe('StarIcon', () => {
  it('is decorative and hidden from assistive technology', () => {
    renderWithTheme(<StarIcon />);
    expect(screen.getByTestId('star-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws the star from the svg asset as a mask', () => {
    renderWithTheme(<StarIcon />);
    expect(screen.getByTestId('star-icon')).toHaveStyleRule(
      'mask',
      'url("test-file-stub") center / contain no-repeat',
    );
  });

  it('follows the text colour by default and accepts a custom colour', () => {
    const { rerender } = renderWithTheme(<StarIcon />);
    expect(screen.getByTestId('star-icon')).toHaveStyleRule('background-color', 'currentColor');
    rerender(<StarIcon color="#fff" />);
    expect(screen.getByTestId('star-icon')).toHaveStyleRule('background-color', '#fff');
  });
});
