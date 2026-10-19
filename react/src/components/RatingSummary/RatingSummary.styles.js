import styled from 'styled-components';

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(12px, 3vw, 18px);
  width: 100%;
`;

export const Heading = styled.h2`
  margin: 0;
  font-size: clamp(1.1rem, 4.5vw, 1.35rem);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const Score = styled.p`
  margin: 0;
  font-size: clamp(0.75rem, 3vw, 0.875rem);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;
