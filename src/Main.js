import React, { Component } from 'react';
import { Route, NavLink, BrowserRouter } from 'react-router-dom';
import Home from './Official/Home';
import Calendar from './Official/Calendar';
import Contact from './Official/Contact';
import ApplyForMembership from './Official/ApplyForMembership';
import Authentication from './components/Authentication';
import User from './Models/User';
//import { Editor } from '@tinymce/tinymce-react';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			user: undefined
		};

		this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
		this.handleLoginFailure = this.handleLoginFailure.bind(this);
		this.handleLogoutSuccess = this.handleLogoutSuccess.bind(this);
	}
    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1>Välkommen till KFUM Voxette!</h1>
                    <ul className="menu">
                        <li><NavLink exact to="/">Hem</NavLink></li>
                        <li><NavLink to="/kalender">Kalender</NavLink></li>
                        <li><NavLink to="/kontakt">Kontakt</NavLink></li>
                        <li><NavLink to="/ansokan">Ansökan</NavLink></li>
						<li>
							<Authentication onLoginSuccess={this.handleLoginSuccess}
											onLoginFailure={this.handleLoginFailure}
											onLogoutSuccess={this.handleLogoutSuccess}
											loggedIn={this.state.loggedIn}
											user={this.state.user} />
						</li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/kalender" component={Calendar}/>
                        <Route path="/kontakt" component={Contact}/>
                        <Route path="/ansokan" component={ApplyForMembership}/>
                    </div>
                </div>				
            </BrowserRouter>
        );
	}
	
	handleLoginSuccess(response) {
		// TODO: Check that the user exists in db as member
		// TODO: Save session logged in state
		console.log('Success: ', response);
		this.setState({
			loggedIn: true,
			user: new User(response.profileObj.givenName,
							response.profileObj.familyName,
							response.profileObj.email,
							response.profileObj.googleId)
		});
	}
	handleLoginFailure(response) {
		console.log('Failure: ', response);
		this.setState({
			loggedIn: false,
			user: undefined
		});
	}
	handleLogoutSuccess(response) {
		console.log('Logout: ', response);
		this.setState({
			loggedIn: false,
			user: undefined
		});
	}
}

export default Main;