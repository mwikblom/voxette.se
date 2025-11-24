import React, { Component } from 'react';
import { Route, Switch, NavLink, BrowserRouter } from 'react-router-dom';
import PageController from './pages/PageController';
import FirebaseApp from './FirebaseApp';
import NotFound from './pages/NotFound';
import Message from './components/Message';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Divider,
  Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Authentication from './components/Authentication';
import User from './models/User';
import MenuItemLink from './components/MenuItemLink';

import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#EA9AC3',
      main: '#22222A',
      dark: '#6A1046',
      contrastText: '#fff',
    },
    secondary: {
      light: '#00afde',
      main: '#0069b2',
      dark: '#0a1b3f',
      contrastText: '#fff',
    },
    text: {
      primary: '#22222A',
      secondary: '#22222A',
    },
    background: {
      default: '#FFF6F3',
    },
    common: {
      black: '#22222A',
      white: '#FFF6F3',
    }
  },
  typography: {
    allVariants: {
      fontFamily: '"Poppins", sans-serif',
    },
    h1: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '1.17rem',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '1rem',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '0.83rem',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '0.67rem',
      fontWeight: 700,
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: '0.25rem 1.5rem',
      },
    },
  },
});

const styles = (theme) => ({
  titleLink: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
  },
  title: {
    flex: 1,
    fontSize: '1.5rem',
  },
  menuButton: {
    marginLeft: theme.spacing(-1.5),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(),
    },
  },
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    margin: '0 auto',
    maxWidth: '1200px',
  },
  navLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    display: 'block',
    maxWidth: '100%',
    width: '16rem',
  },
  logo: {
    width: '100%',
    aspectRatio: '1 / 1',
  },
  logoContainer: {
    padding: theme.spacing(1),
    maxHeight: theme.spacing(10),
    maxWidth: theme.spacing(10),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      maxHeight: theme.spacing(8),
      maxWidth: theme.spacing(8),
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: undefined,
      anchorEl: null,
      messageVariant: 'info',
      updatedPicture: undefined,
    };

    // Functions
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.handleLogoutSuccess = this.handleLogoutSuccess.bind(this);
  }
  render() {
    this.pageController = new PageController(
      this.state.loggedIn,
      this.state.user
    );

    const { classes } = this.props;
    const { anchorEl, messageText, messageVariant } = this.state;

    // Init internal routing
    const internalMenu = this.state.loggedIn ? (
      <Box>
        <Divider />
        <MenuItemLink className={classes.navLink} to="/inloggad/medlemmar">
          Medlemmar
        </MenuItemLink>
        <MenuItemLink className={classes.navLink} to="/inloggad/kalender">
          Intern kalender
        </MenuItemLink>
        <MenuItemLink className={classes.navLink} to="/inloggad/filer">
          Filer
        </MenuItemLink>
      </Box>
    ) : undefined;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Message text={messageText} variant={messageVariant} />
        <BrowserRouter>
          <div>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                  aria-owns={anchorEl ? 'main-menu' : null}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="main-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                  onClick={this.handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItemLink className={classes.navLink} exact to="/">
                    Hem
                  </MenuItemLink>
                  <MenuItemLink className={classes.navLink} to="/dirigent">
                    Dirigent
                  </MenuItemLink>
                  <MenuItemLink className={classes.navLink} to="/kontakt">
                    Kontakt
                  </MenuItemLink>
                  {internalMenu}
                </Menu>

                <NavLink
                  className={`${classes.titleLink} ${classes.logoContainer}`}
                  exact
                  to="/"
                >
                  <img
                    src="/images/voxette.png"
                    className={classes.logo}
                    alt=""
                  />
                </NavLink>
                <div className={classes.title}>
                  <NavLink className={classes.titleLink} exact to="/">
                    Voxette
                  </NavLink>
                </div>
                <Authentication
                  onLoginSuccess={this.handleLoginSuccess}
                  onLoginFailure={this.handleLoginFailure}
                  onLogoutSuccess={this.handleLogoutSuccess}
                  loggedIn={this.state.loggedIn}
                  user={this.state.user}
                  updatedPicture={this.state.updatedPicture}
                />
              </Toolbar>
            </AppBar>

            <div className={classes.content}>
              <div id="info-message"></div>
              <Switch>
                <Route exact path="/" render={this.pageController.HomePage} />
                <Route
                  path="/kalender"
                  render={this.pageController.CalendarPage}
                />
                <Route
                  path="/kontakt"
                  render={this.pageController.ContactPage}
                />
                <Route
                  path="/ansokan"
                  render={this.pageController.ApplyForMembershipPage}
                />
                <Route
                  path="/dirigent"
                  render={this.pageController.Conductor}
                />
                <Route path="/gdpr" render={this.pageController.GDPR} />

                <Route
                  exact
                  path="/inloggad/"
                  render={this.pageController.InformationPage}
                />
                <Route
                  path="/inloggad/medlemmar"
                  render={this.pageController.MembersPage}
                />
                <Route
                  path="/inloggad/medlem/:memberId"
                  render={this.pageController.MemberPage}
                />
                <Route
                  path="/inloggad/kalender"
                  render={this.pageController.InternalCalendarPage}
                />
                <Route
                  path="/inloggad/filer"
                  render={this.pageController.FilesPage}
                />
                <Route
                  path="/inloggad/ladda-ned/:fullPath"
                  render={this.pageController.DownloadFilePage}
                />
                <Route
                  path="/inloggad/fil/:fullPath"
                  render={this.pageController.FilePage}
                />

                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }

  // Functions
  handleLoginSuccess(response) {
    const email = response.email;
    const googleId = response.uid;
    const picture = response.photoURL;

    FirebaseApp.voxette.fetchUserData(email, (userData) => {
      if (userData) {
        if (userData.googleId) {
          this.setState({
            loggedIn: true,
            user: new User(googleId, userData, email, picture),
            messageText: 'Du är nu inloggad!',
            messageVariant: 'success',
            updatedPicture: picture,
          });
        } else {
          // first login - generate the user data
          const user = new User(googleId, response.displayName, email, picture);
          const initialUserData = user.InitialUserData;

          FirebaseApp.voxette.saveUserData(
            userData.memberId,
            initialUserData,
            () => {
              this.setState({
                loggedIn: true,
                user: user,
                messageText: 'Skapade användare för ' + user.FirstName,
                messageVariant: 'info',
              });
            }
          );
        }
      } else {
        this.setState({
          loggedIn: false,
          user: undefined,
          messageText: 'Hoppsan! Användare ' + email + ' saknas',
          messageVariant: 'warning',
        });
      }
    });
  }

  handleLoginFailure(error) {
    this.setState({
      loggedIn: false,
      user: undefined,
      messageText: `Inloggningen misslyckades: ${error.message}`,
      messageVariant: 'warning',
    });
  }

  handleLogoutSuccess() {
    this.setState({
      loggedIn: false,
      user: undefined,
    });
    // TODO: Redirect user?
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
