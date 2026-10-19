import PropTypes from 'prop-types';
import Star from '../Star';
import { clamp } from '../../utils/rating';
import { Stars } from './StarRating.styles';

const StarRating = ({ value, max = 5, maxWidth = 270 }) => (
  <Stars role="img" aria-label={`Rated ${value} out of ${max} stars`} $maxWidth={maxWidth}>
    {Array.from({ length: max }, (_, index) => (
      <Star key={index} fill={clamp(Math.round((value - index) * 100) / 100, 0, 1)} />
    ))}
  </Stars>
);

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  /** Upper bound for the row width in px; the row shrinks below this on narrow screens. */
  maxWidth: PropTypes.number,
};

export default StarRating;
