import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

export default class Authentication extends Component {
    constructor (props) {
        super(props);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                props.onLoginSuccess(user);
            } else {
                props.onLogoutSuccess();
            }
        });

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    render() {
        if (this.props.loggedIn){
            return (
                <div>
                    <p>
                        Inloggad som: {this.props.user.FirstName} {this.props.user.LastName}
                    </p>
                    <button onClick={this.handleLogout}>Logga ut</button>
                </div>
            );
        }
        return (
            <button onClick={this.handleLogin}>Logga in</button>
        );
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
        }).catch(function(error) {
            document.getElementById('info-message').innerHTML = '<p class="error">Något gick fel vid utloggning.</p>';
            console.error(error);
        });
    }    
}