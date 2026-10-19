import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the product rating widget with sample data', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Excellent' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
  });
});
