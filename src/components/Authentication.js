import React, { Component } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from 'firebase/auth';
import FirebaseApp from '../FirebaseApp';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import {
  Button,
  MenuItem,
  Menu,
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
  ListItemIcon,
  TextField,
  FormGroup,
  DialogContent,
  Typography,
} from '@material-ui/core';

const styles = (theme) => ({
  content: {
    paddingRight: theme.spacing(3),
  },
  chip: {
    margin: theme.spacing(),
  },
  menuItem: {
    maxWidth: '100%',
    width: theme.spacing(31.25),
  },
  dialogContent: {
    marginBottom: theme.spacing(2)
  },
  loginHeading: {
    margin: 0,
  },
  gmailHeading: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
});

class Authentication extends Component {
  constructor(props) {
    super(props);
    getAuth().onAuthStateChanged(function (user) {
      if (user) {
        props.onLoginSuccess(user);
      } else {
        props.onLogoutSuccess();
      }
    });

    this.state = {
      anchorEl: null,
      loginOpen: false,
      email: '',
      password: '',
      error: '',
      changePasswordOpen: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  render() {
    const { anchorEl, loginOpen } = this.state;
    const { classes, user, loggedIn, updatedPicture } = this.props;

    return loggedIn ? (
      <div className={classes.content}>
        <Button
          aria-owns={anchorEl ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Chip
            avatar={
              user && user.Picture ? (
                <Avatar src={user.Picture} />
              ) : (
                <Avatar>
                  <PersonIcon />
                </Avatar>
              )
            }
            label={user.FirstName}
            className={classes.chip}
            color="primary"
          />
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {updatedPicture != user.picture ? (
            <MenuItem
              className={classes.menuItem}
              onClick={() => this.updatePicture(updatedPicture)}
            >
              <ListItemIcon>
                <RefreshIcon />
              </ListItemIcon>
              <ListItemText primary="Uppdatera bild" />
            </MenuItem>
          ) : undefined}
          {user && user.picture ? (
            <MenuItem
              className={classes.menuItem}
              onClick={() => this.updatePicture('')}
            >
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Ta bort bild" />
            </MenuItem>
          ) : undefined}
          <MenuItem className={classes.menuItem} onClick={this.handleLogout}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Logga ut" />
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            onClick={this.handleClickOpenChangePassword}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Ändra lösenord" />
          </MenuItem>
        </Menu>

        <Dialog
          open={this.state.changePasswordOpen}
          onClose={this.handleClickClose}
          aria-labelledby="change-password-title"
        >
          <DialogTitle id="change-password-title">
            Ändra lösenord för {getAuth().currentUser.email}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.handleChangePassword(this.state.password);
              }}
            >
              <FormGroup>
                <TextField
                  variant="outlined"
                  name="password"
                  type="password"
                  label="Nytt lösenord"
                  value={this.state.password}
                  onChange={(e) =>
                    this.setState({
                      password: e.target.value,
                      error: '',
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Button
                  name="logon"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Ändra lösenord
                </Button>
                {this.state.error ? (
                  <Typography>{this.state.error}</Typography>
                ) : null}
              </FormGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <div className={classes.content}>
        <Button onClick={this.handleClickOpen} color="inherit">
          Logga in
        </Button>
        <Dialog
          open={loginOpen}
          onClose={this.handleClickClose}
          aria-labelledby="login-title"
        >
          <DialogTitle id="login-title" disableTypography>
            <h2 className={classes.loginHeading}>
              Logga in med email och lösenord
            </h2>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.handlePasswordLogin(
                  this.state.email,
                  this.state.password
                );
              }}
            >
              <FormGroup>
                <TextField
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  value={this.state.email}
                  onChange={(e) =>
                    this.setState({ email: e.target.value, error: '' })
                  }
                />
                <TextField
                  name="password"
                  type="password"
                  label="Lösenord"
                  variant="outlined"
                  value={this.state.password}
                  onChange={(e) =>
                    this.setState({
                      password: e.target.value,
                      error: '',
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Button
                  name="logon"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
                {this.state.error ? (
                  <Typography>{this.state.error}</Typography>
                ) : null}
              </FormGroup>
            </form>
            <Typography variant="h3" className={classes.gmailHeading}>
              Eller använd ditt gmail-konto
            </Typography>
            <ListItem button onClick={() => this.handleLogin('gmail')}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Gmail" />
            </ListItem>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  handleClickOpen = () => {
    this.setState({ loginOpen: true });
  };

  handleClickOpenChangePassword = () => {
    this.setState({ changePasswordOpen: true });
  };

  handleClickClose = () => {
    this.setState({ loginOpen: false, changePasswordOpen: false });
  };

  handleChangePassword = (newPassword) => {
    var self = this;
    const user = getAuth().currentUser;
    updatePassword(user, newPassword)
      .then(() => {
        self.setState({ changePasswordOpen: false });
      })
      .catch((error) => {
        console.error(error);
        self.setState({ error: error.message });
      });
  };

  handlePasswordLogin = (email, password) => {
    var self = this;

    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        self.props.onLoginSuccess(user);
        self.setState({ loginOpen: false });
      })
      .catch((error) => {
        console.error(error);
        self.setState({ error: error.message });
        self.props.onLoginFailure(error);
      });
  };

  updatePicture = (picture) => {
    const { user } = this.props;
    user.picture = picture;
    FirebaseApp.voxette.saveUserData(user.memberId, user.AllUserData, () => {});
    this.handleClose();
  };

  handleLogin(method) {
    var self = this;
    var user = getAuth().currentUser;

    if (!this.loggedIn) {
      if (user != null) {
        // User already logged in
        this.props.onLoginSuccess(user);
        return false;
      }
      getAuth().useDeviceLanguage();

      var provider;
      if (method === 'gmail') {
        provider = new GoogleAuthProvider();
      }

      signInWithPopup(getAuth(), provider)
        .then(function (result) {
          //var token = result.credential.accessToken;
          var user = result.user;

          self.props.onLoginSuccess(user);

          self.setState({ loginOpen: false });
        })
        .catch(function (error) {
          console.error(error);
          self.props.onLoginFailure(error);
          self.setState({ loginOpen: false });
        });
    }
  }

  handleLogout() {
    var self = this;
    document.getElementById('info-message').innerHTML = '';
    signOut(getAuth())
      .then(function () {
        self.props.onLogoutSuccess();
        self.handleClose();
      })
      .catch(function (error) {
        document.getElementById('info-message').innerHTML =
          '<p class="error">Något gick fel vid utloggning.</p>';
        console.error(error);
      });
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
  onLogoutSuccess: PropTypes.func.isRequired,
  onLoginFailure: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default withStyles(styles)(Authentication);
