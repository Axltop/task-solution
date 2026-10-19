import styled from 'styled-components';

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(20px, 6vw, 32px);
  width: min(100%, 420px);
  padding: clamp(28px, 8vw, 48px) clamp(18px, 6vw, 32px) clamp(24px, 6vw, 32px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.fontFamily};
  color: ${({ theme }) => theme.colors.text};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(14px, 4vw, 22px);
  width: 100%;
  padding-bottom: clamp(8px, 3vw, 20px);
`;
