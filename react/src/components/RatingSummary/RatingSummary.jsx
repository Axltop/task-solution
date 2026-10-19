import PropTypes from 'prop-types';
import StarRating from '../StarRating';
import { Heading, Score, Summary } from './RatingSummary.styles';

const RatingSummary = ({ headingId, label, average, maxRating = 5 }) => (
  <Summary>
    <Heading id={headingId}>{label}</Heading>
    <StarRating value={average} max={maxRating} />
    {/* The star row already announces the score, so the visual copy is hidden from AT. */}
    <Score aria-hidden="true">
      {average} out of {maxRating}
    </Score>
  </Summary>
);

RatingSummary.propTypes = {
  headingId: PropTypes.string,
  label: PropTypes.string.isRequired,
  average: PropTypes.number.isRequired,
  maxRating: PropTypes.number,
};

export default RatingSummary;
