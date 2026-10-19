import { useId } from 'react';
import PropTypes from 'prop-types';
import RatingSummary from '../RatingSummary';
import ProviderBadge from '../ProviderBadge';
import RatingBreakdown from '../RatingBreakdown';
import { getAverage, getLabel, roundToOneDecimal } from '../../utils/rating';
import { Card, Header } from './ProductRating.styles';

// `distribution` is required (PropTypes warns), but an empty fallback renders an empty card instead of crashing.
const ProductRating = ({ distribution = {}, average, maxRating = 5, caption, logoSrc }) => {
  const headingId = useId();
  // Round once here so the stars, their accessible name and the visible score all agree.
  const score = roundToOneDecimal(average ?? getAverage(distribution));

  return (
    <Card aria-labelledby={headingId}>
      <Header>
        <RatingSummary
          headingId={headingId}
          label={getLabel(score, maxRating)}
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
