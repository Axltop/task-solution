import styled from 'styled-components';

export const Stars = styled.div`
  display: flex;
  gap: clamp(3px, 1.2vw, 6px);
  width: min(100%, ${({ $maxWidth }) => $maxWidth}px);
`;
