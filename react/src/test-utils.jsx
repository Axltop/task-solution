import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

export const renderWithTheme = (ui, options) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
