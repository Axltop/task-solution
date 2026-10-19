import '@testing-library/jest-dom';
import 'jest-styled-components';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
