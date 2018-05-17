import React, { Component } from 'react';
import { Route, Switch, NavLink, BrowserRouter } from 'react-router-dom';
import PageController from './pages/PageController';
import NotFound from './pages/NotFound';

// Components
import Authentication from './components/Authentication';
import User from './models/User';
//import { Editor } from '@tinymce/tinymce-react';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: undefined
        };

        // Functions
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.handleLogoutSuccess = this.handleLogoutSuccess.bind(this);
    }
    render() {
        this.pageController = new PageController(this.state.loggedIn, this.state.user);

        // Init internal routing
        const internalMenu = this.state.loggedIn
            ? (
                <ul className="internal-menu">
                    <li><NavLink exact to="/inloggad/">Information</NavLink></li>
                    <li><NavLink to="/inloggad/medlemmar">Medlemmar</NavLink></li>
                    <li><NavLink to="/inloggad/kalender">Kalender</NavLink></li>
                    <li><NavLink to="/inloggad/dokument">Dokument</NavLink></li>
                </ul>
            )
            : undefined;

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
                    {internalMenu}

                    <div className="content">
                        <div id="info-message"></div>
                        <Switch>
                            <Route exact path="/" render={this.pageController.HomePage} />
                            <Route path="/kalender" render={this.pageController.CalendarPage} />
                            <Route path="/kontakt" render={this.pageController.ContactPage} />
                            <Route path="/ansokan" render={this.pageController.ApplyForMembershipPage} />
							
                            <Route exact path="/inloggad/" render={this.pageController.InformationPage} />
                            <Route path="/inloggad/medlemmar" render={this.pageController.MembersPage} />
                            <Route path="/inloggad/kalender" render={this.pageController.InternalCalendarPage} />
                            <Route path="/inloggad/dokument" render={this.pageController.DocumentsPage} />
							
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </div>				
            </BrowserRouter>
        );
    }
	
    // Functions
    handleLoginSuccess(response) {
        // TODO: Check that the user exists in db as member
		this.setState({
			loggedIn: true,
			user: new User(response.displayName,
							'', // Can't get name separated from this google auth?
							response.email,
                            response.uid,
                            response.photoURL)
		});
    }
    
	handleLoginFailure(response) {
		// TODO: Show error message
		console.log('Failure: ', response);
		this.setState({
			loggedIn: false,
			user: undefined
		});
    }
    
	handleLogoutSuccess() {
		this.setState({
			loggedIn: false,
			user: undefined
		});
		// TODO: Redirect user?
	}

}

export default Main;