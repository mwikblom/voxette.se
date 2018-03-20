import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import FirebaseApp from '../FirebaseApp';
console.log(FirebaseApp);

class Authentication extends Component {
	constructor (props) {
		super(props);

		this.state = {
			loggedIn: false
		};
		this.onSuccess = this.onSuccess.bind(this);
		this.onFailure = this.onFailure.bind(this);
		this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
	}
	render() {
		if (this.state.loggedIn){
			return (
				<GoogleLogout
					buttonText="Logga ut"
					onLogoutSuccess={this.onLogoutSuccess} />
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
		console.log('Success', response);
		this.setState({
			loggedIn: true
		});
	}

	onFailure = (response) => {
		console.log('Failure', response);
		this.setState({
			loggedIn: true
		});
	}

	onLogoutSuccess = (response) => {
		console.log('Logged out', response);
		this.setState({
			loggedIn: false
		});
	}
}

export default Authentication;