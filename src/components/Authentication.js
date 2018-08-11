import React, { Component } from 'react';
import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = {
};

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

        return this.props.loggedIn ? 
            <div>
                <IconButton
                    aria-owns={anchorEl ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                    >
                    <AccountCircle />
                    {this.props.user.FirstName} {this.props.user.LastName} 
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
    user: PropTypes.object.isRequired
};
  
export default withStyles(styles)(Authentication);