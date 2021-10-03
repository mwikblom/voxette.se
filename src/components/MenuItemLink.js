import React from 'react';
import { withRouter } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Custom MenuItem component that redirects using the router.
 */
const MenuItemLink = withRouter((props) => (
  <MenuItem onClick={() => props.history.push(props.to)} {...props}>
    {props.children}
  </MenuItem>
));
export default MenuItemLink;
