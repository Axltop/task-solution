import styled from 'styled-components';
import StarIcon from '../StarIcon';

export const Tile = styled.span`
  position: relative;
  display: block;
  flex: 1 1 0;
  min-width: 0;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.tile};
  background: ${({ theme }) => theme.colors.track};
`;

export const Fill = styled.span`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $fill }) => `${$fill * 100}%`};
  background: ${({ theme }) => theme.colors.accent};
`;

export const Icon = styled(StarIcon)`
  position: absolute;
  inset: 0;
  margin: auto;
  width: 62%;
  height: 62%;
`;
