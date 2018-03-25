import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import FirebaseApp from '../FirebaseApp';

export default class Authentication extends Component {
	constructor (props) {
		super(props);

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