import PropTypes from 'prop-types';
import defaultLogo from '../../assets/logo.png';
import { Badge, Caption, Logo } from './ProviderBadge.styles';

/* The logo is decorative (empty alt, hidden from AT), so the badge reads only as its caption. */
const ProviderBadge = ({ caption = 'Product Rating', logoSrc = defaultLogo }) => (
  <Badge>
    <Caption>{caption}</Caption>
    <Logo src={logoSrc} alt="" aria-hidden="true" />
  </Badge>
);

ProviderBadge.propTypes = {
  caption: PropTypes.string,
  /** URL of the provider logo image; defaults to the bundled `assets/logo.png`. */
  logoSrc: PropTypes.string,
};

export default ProviderBadge;
