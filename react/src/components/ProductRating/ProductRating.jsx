import { useId } from 'react';
import PropTypes from 'prop-types';
import RatingSummary from '../RatingSummary';
import ProviderBadge from '../ProviderBadge';
import RatingBreakdown from '../RatingBreakdown';
import { getAverage, getLabel } from '../../utils/rating';
import { Card, Header } from './ProductRating.styles';

const ProductRating = ({ distribution, average, maxRating = 5, caption, logoSrc }) => {
  const headingId = useId();
  const score = average ?? getAverage(distribution);

  return (
    <Card aria-labelledby={headingId}>
      <Header>
        <RatingSummary
          headingId={headingId}
          label={getLabel(score)}
          average={score}
          maxRating={maxRating}
        />
        <ProviderBadge caption={caption} logoSrc={logoSrc} />
      </Header>
      <RatingBreakdown distribution={distribution} maxRating={maxRating} />
    </Card>
  );
};

ProductRating.propTypes = {
  /** Review counts keyed by star level, e.g. `{ 5: 952, 4: 171, 3: 55, 2: 14, 1: 40 }`. */
  distribution: PropTypes.objectOf(PropTypes.number).isRequired,
  /** Headline score; computed from `distribution` when omitted. */
  average: PropTypes.number,
  maxRating: PropTypes.number,
  caption: PropTypes.string,
  logoSrc: PropTypes.string,
};

export default ProductRating;
