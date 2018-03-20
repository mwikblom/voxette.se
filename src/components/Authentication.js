import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import FirebaseApp from '../FirebaseApp';
import User from '../Models/User';

export default class Authentication extends Component {
	constructor (props) {
		super(props);

		this.state = {
			loggedIn: false,
			user: undefined
		};

		this.onSuccess = this.onSuccess.bind(this);
		this.onFailure = this.onFailure.bind(this);
		this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
	}
	render() {
		if (this.state.loggedIn){
			return (
				<div>
					<p>
						Inloggad som: {this.state.user.FirstName} {this.state.user.LastName}
					</p>
					<GoogleLogout
						buttonText="Logga ut"
						onLogoutSuccess={this.onLogoutSuccess} />
				</div>
			);
		}
		return (
			<GoogleLogin
				clientId={FirebaseApp.customSettings.google.clientId}
				buttonText='Logga in'
				onSuccess={this.onSuccess}
				onFailure={this.onFailure} />
		);
	}

	onSuccess = (response) => {
		// TODO: Check that the user exists in db as member
		// TODO: Save session logged in state
		console.log('Success', response);
		this.setState({
			loggedIn: true,
			user: new User(response.profileObj.givenName,
							response.profileObj.familyName,
							response.profileObj.email,
							response.profileObj.googleId)
		});
	}

	onFailure = (response) => {
		// TODO: Show error message  
		console.log('Failure', response);
		this.setState({
			loggedIn: false,
			user: undefined
		});
	}

	onLogoutSuccess = (response) => {
		console.log('Logged out', response);
		this.setState({
			loggedIn: false,
			user: undefined
		});
	}
}