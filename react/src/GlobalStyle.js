import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.page};
    -webkit-font-smoothing: antialiased;
  }
`;

export default GlobalStyle;
