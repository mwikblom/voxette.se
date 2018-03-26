import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import firebase from 'firebase';
import FirebaseApp from '../FirebaseApp';

export default class Authentication extends Component {
	constructor (props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

		this.onSuccess = this.onSuccess.bind(this);
		this.onFailure = this.onFailure.bind(this);
		this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
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

        FirebaseApp.auth().useDeviceLanguage();
        var provider = new firebase.auth.GoogleAuthProvider();
        //provider.addScope('https://www.googleapis.com/auth/groups');
        console.log('Current-user', FirebaseApp.auth().currentUser);
        FirebaseApp.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log('Login-result', result);
            self.props.onLoginSuccess(result);
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

    handleLogout() {
        var self = this;

        
    }

	onSuccess(response) {
		this.props.onLoginSuccess(response);
	}

	onFailure(response) {
		this.props.onLoginFailure(response);
	}

	onLogoutSuccess(response) {
		this.props.onLogoutSuccess(response);
	}
}