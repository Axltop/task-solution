import PropTypes from 'prop-types';
import RatingBar from '../RatingBar';
import { getTotal } from '../../utils/rating';
import { List } from './RatingBreakdown.styles';

const RatingBreakdown = ({ distribution, maxRating = 5 }) => {
  const total = getTotal(distribution);
  const levels = Array.from({ length: maxRating }, (_, index) => maxRating - index);

  return (
    <List aria-label="Rating breakdown">
      {levels.map((stars) => (
        <RatingBar key={stars} stars={stars} count={distribution[stars] ?? 0} total={total} />
      ))}
    </List>
  );
};

RatingBreakdown.propTypes = {
  /** Review counts keyed by star level, e.g. `{ 5: 952, 4: 171 }`. */
  distribution: PropTypes.objectOf(PropTypes.number).isRequired,
  maxRating: PropTypes.number,
};

export default RatingBreakdown;
