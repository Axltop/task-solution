import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import ProviderBadge from './ProviderBadge';

describe('ProviderBadge', () => {
  it('reads as "Product Rating"', () => {
    const { container } = renderWithTheme(<ProviderBadge />);
    expect(container.querySelector('p')).toHaveTextContent(/^Product Rating$/);
  });

  it('shows the bundled logo as a decorative image', () => {
    const { container } = renderWithTheme(<ProviderBadge />);
    const logo = container.querySelector('img');
    expect(logo).toHaveAttribute('src', 'test-file-stub');
    expect(logo).toHaveAttribute('alt', '');
    expect(logo).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('accepts a custom caption and logo', () => {
    const { container } = renderWithTheme(
      <ProviderBadge caption="Service Rating" logoSrc="/other-logo.png" />,
    );
    expect(screen.getByText('Service Rating')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', '/other-logo.png');
  });
});
