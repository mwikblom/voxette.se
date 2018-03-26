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
            if (user != null) {
                console.log(user);
                this.props.onLoginSuccess(user);
                return false;
            }
            FirebaseApp.auth().useDeviceLanguage();
            var provider = new firebase.auth.GoogleAuthProvider();
            //provider.addScope('https://www.googleapis.com/auth/groups');
            
            if (FirebaseApp.auth().currentUser != null){

            }
            FirebaseApp.auth().signInWithPopup(provider).then(function(result) {
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                console.log('Login-result', result);
                self.props.onLoginSuccess(user);
                // ...
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        }
    }

    handleLogout() {
        // TODO: log out
        this.props.onLogoutSuccess();
    }
}