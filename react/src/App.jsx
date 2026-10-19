import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { theme } from './theme';
import ProductRating from './components/ProductRating';
import sampleRating from './data/sampleRating';

const Main = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
`;

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Main>
      <ProductRating distribution={sampleRating.distribution} />
    </Main>
  </ThemeProvider>
);

export default App;
