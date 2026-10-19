import styled from 'styled-components';
import StarIcon from '../StarIcon';

export const Row = styled.li`
  display: grid;
  grid-template-columns: auto 1fr 4ch;
  align-items: center;
  gap: clamp(10px, 3.5vw, 18px);
  font-size: clamp(0.8rem, 3.2vw, 0.875rem);
  color: ${({ theme }) => theme.colors.muted};
`;

export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
`;

/* Fixed-width slot with tabular digits, so "1" and "5" take the same space and every row's star lines up. */
export const Digit = styled.span`
  min-width: 1ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const LabelStar = styled(StarIcon)`
  width: 1.4em;
  height: 1.4em;
  color: ${({ theme }) => theme.colors.track};
`;

export const Track = styled.div`
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.bar};
  background: ${({ theme }) => theme.colors.track};
  overflow: hidden;
`;

export const Fill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => `${$ratio * 100}%`};
  min-width: ${({ $ratio }) => ($ratio > 0 ? '3px' : '0')};
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.accent};
`;

export const Count = styled.span`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;
