import styled from 'styled-components';

export const Badge = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  margin: 0;
`;

export const Caption = styled.span`
  font-size: clamp(0.95rem, 3.8vw, 1.1rem);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Logo = styled.img`
  display: block;
  width: auto;
  height: clamp(1.4rem, 5.5vw, 1.75rem);
`;
