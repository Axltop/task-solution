import PropTypes from 'prop-types';
import { getPercent } from '../../utils/rating';
import { Count, Digit, Fill, Label, LabelStar, Row, Track } from './RatingBar.styles';

const pluralise = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

const RatingBar = ({ stars, count, total }) => {
  const percent = getPercent(count, total);
  const ratio = total === 0 ? 0 : count / total;

  return (
    <Row>
      {/* Label and count are repeated in the progressbar's accessible name, so they are hidden from AT. */}
      <Label aria-hidden="true">
        <Digit>{stars}</Digit>
        <LabelStar />
      </Label>
      <Track
        role="progressbar"
        aria-label={pluralise(stars, 'star')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${pluralise(count, 'review')} (${percent}%)`}
      >
        <Fill data-testid="rating-bar-fill" $ratio={ratio} />
      </Track>
      <Count aria-hidden="true">{count}</Count>
    </Row>
  );
};

RatingBar.propTypes = {
  stars: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default RatingBar;
