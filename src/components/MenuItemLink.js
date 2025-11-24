import { withRouter } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Custom MenuItem component that redirects using the router.
 */
const MenuItemLink = withRouter((props) => (
  <MenuItem onClick={() => props.history.push(props.to)}>
    <NavLink className={props.className} exact={props.exact} to={props.to}>{props.children}</NavLink>
  </MenuItem>
));
export default MenuItemLink;
