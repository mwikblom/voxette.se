import React, { Component } from 'react';
import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    content: {
        paddingRight: theme.spacing.unit * 3
    },
    chip: {
        margin: theme.spacing.unit,
    },
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
            anchorEl: null
        };  

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    render() {
        const { anchorEl } = this.state;
        const { classes, user, loggedIn } = this.props;

        const avatar = function() {
            return (user && user.Picture) ? (
                <Chip
                    avatar={<Avatar src={user.Picture} />}
                    label={user.FirstName}
                    className={classes.chip}
                  />                    
                ) : (
                <Chip
                avatar={
                    <Avatar>
                    <FaceIcon />
                    </Avatar>
                }
                label="user.FirstName"
                className={classes.chip}
                />        
            );
        }

        return loggedIn ? 
            <div className={ classes.content } >
                <IconButton
                    aria-owns={anchorEl ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                    >
                    {avatar()} 
                </IconButton>
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
                    <MenuItem onClick={this.handleLogout}>Logga ut</MenuItem>
                </Menu> 
            </div>           
            :
            <Button onClick={this.handleLogin} color="inherit">Logga in</Button>;
    }
    
    handleLogin() {
        var self = this;
        var user = FirebaseApp.auth().currentUser;
        
        if (!this.loggedIn) {
            if (user != null) { // User already logged in
                this.props.onLoginSuccess(user);
                return false;
            }
            FirebaseApp.auth().useDeviceLanguage();
            var provider = new firebase.auth.GoogleAuthProvider();
            //provider.addScope('https://www.googleapis.com/auth/groups');
            
            document.getElementById('info-message').innerHTML = '';
            FirebaseApp.auth().signInWithPopup(provider).then(function(result) {
                //var token = result.credential.accessToken;
                var user = result.user;
                
                self.props.onLoginSuccess(user);
            }).catch(function(error) {
                document.getElementById('info-message').innerHTML = '<p class="error">Något gick fel vid inloggning.</p>';
                console.error(error);
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