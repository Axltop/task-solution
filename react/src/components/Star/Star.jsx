import PropTypes from 'prop-types';
import { clamp } from '../../utils/rating';
import { Fill, Icon, Tile } from './Star.styles';

const Star = ({ fill = 1 }) => (
  <Tile data-testid="star">
    <Fill data-testid="star-fill" $fill={clamp(fill, 0, 1)} />
    <Icon />
  </Tile>
);

Star.propTypes = {
  /** Portion of the tile filled with the accent colour, from 0 to 1. */
  fill: PropTypes.number,
};

export default Star;
