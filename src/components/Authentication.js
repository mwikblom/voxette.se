import React, { Component } from 'react';
import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';
import PersonIcon from '@material-ui/icons/Person';
import {
    Button,
    MenuItem,
    Menu,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    DialogTitle,
    Dialog
} from '@material-ui/core';

const styles = theme => ({
    content: {
        paddingRight: theme.spacing.unit * 3
    },
    chip: {
        margin: theme.spacing.unit,
    },
    menuItem: {
        maxWidth: '100%',
        width: '250px'
    }
});

class Authentication extends Component {
    constructor (props) {
        super(props);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                props.onLoginSuccess(user);
            } else {
                props.onLogoutSuccess();
            }
        });

        this.state = {
            anchorEl: null,
            loginOpen: false
        };  

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    render() {
        const { anchorEl, loginOpen } = this.state;
        const { classes, user, loggedIn } = this.props;

        const avatar = function() {
            return (user && user.Picture) ? (<Avatar src={user.Picture} />) : (<Avatar><FaceIcon /></Avatar>)
        }

        return loggedIn ?
            <div className={ classes.content } >
                <Button
                    aria-owns={anchorEl ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                    >
                    <Chip
                        avatar={avatar()} 
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
                    <MenuItem className={classes.menuItem} onClick={this.handleLogout}>Logga ut</MenuItem>
                </Menu>
            </div>
            :
            <div className={ classes.content }>
                <Button onClick={this.handleClickOpen} color="inherit">Logga in</Button>

                <Dialog
                    open={loginOpen}
                    onClose={this.handleClickClose} 
                    aria-labelledby="simple-dialog-title">
                <DialogTitle id="simple-dialog-title">Logga in med</DialogTitle>
                <div>
                    <List>
                        <ListItem button onClick={() => this.handleLogin('gmail')}>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Gmail" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleLogin('facebook')}>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Facebook" />
                        </ListItem>
                    </List>
                </div>
            </Dialog>
          </div>
    }
    
    handleClickOpen = () => {
        this.setState({ loginOpen: true });
    }

    handleClickClose = () => {
        this.setState({ loginOpen: false });
    }

    handleLogin(method) {
        var self = this;
        var user = FirebaseApp.auth().currentUser;
        
        if (!this.loggedIn) {
            if (user != null) { // User already logged in
                this.props.onLoginSuccess(user);
                return false;
            }
            FirebaseApp.auth().useDeviceLanguage();

            var provider;
            if (method === 'gmail') {
                provider = new firebase.auth.GoogleAuthProvider();
            } else if (method === 'facebook') {
                provider = new firebase.auth.FacebookAuthProvider();
            }
            
            FirebaseApp
                .auth()
                .signInWithPopup(provider)
                .then(function(result) {
                    //var token = result.credential.accessToken;
                    var user = result.user;
                    
                    self.props.onLoginSuccess(user);

                    self.setState({ loginOpen: false });
                }).catch(function(error) {
                    console.error(error);
                    self.props.onLoginFailure(error);
                    self.setState({ loginOpen: false })
                });
        }
    }

    handleLogout() {
        var self = this;
        document.getElementById('info-message').innerHTML = '';
        firebase.auth().signOut().then(function() {
            self.props.onLogoutSuccess();
            self.handleClose();
        }).catch(function(error) {
            document.getElementById('info-message').innerHTML = '<p class="error">Något gick fel vid utloggning.</p>';
            console.error(error);
        });
    }    

    handleMenu = event => {
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
    user: PropTypes.object
};
  
export default withStyles(styles)(Authentication);