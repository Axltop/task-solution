import PropTypes from 'prop-types';
import styled from 'styled-components';
import starUrl from '../../assets/star.svg';

/*
 * The star shape comes from assets/star.svg, used as a CSS mask over a block of colour.
 * That keeps the artwork in one file while letting each usage pick the colour
 * (white on the rating tiles, grey in the breakdown rows) through `color`.
 */
const Glyph = styled.span`
  display: inline-block;
  background-color: ${({ $color }) => $color};
  -webkit-mask: url("${starUrl}") center / contain no-repeat;
  mask: url("${starUrl}") center / contain no-repeat;
`;

const StarIcon = ({ className, color = 'currentColor' }) => (
  <Glyph className={className} $color={color} aria-hidden="true" data-testid="star-icon" />
);

StarIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
};

export default StarIcon;
