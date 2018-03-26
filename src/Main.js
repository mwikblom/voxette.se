import React, { Component } from 'react';
import { Route, Switch, NavLink, BrowserRouter } from 'react-router-dom';

// External pages
import Home from './pages/external/Home';
import Calendar from './pages/external/Calendar';
import Contact from './pages/external/Contact';
import ApplyForMembership from './pages/external/ApplyForMembership';
import NotFound from './pages/NotFound';
import RequiresLogin from './pages/RequiresLogin';

// Internal pages
import Information from './pages/internal/Information';
import InternalCalendar from './pages/internal/Calendar';
import Documents from './pages/internal/Documents';
import Members from './pages/internal/Members';

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

        // Properties
        // Internal Pages
        this.informationPage = this.informationPage.bind(this);
        this.internalCalendarPage = this.internalCalendarPage.bind(this);
        this.documentsPage = this.documentsPage.bind(this);
        this.membersPage = this.membersPage.bind(this);
        // External Pages
        this.homePage = this.homePage.bind(this);
        this.calendarPage = this.calendarPage.bind(this);
        this.contactPage = this.contactPage.bind(this);
        this.applyForMembershipPage = this.applyForMembershipPage.bind(this);
    }
    render() {
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
                        <Switch>
                            <Route exact path="/" render={this.homePage} />
                            <Route path="/kalender" render={this.calendarPage} />
                            <Route path="/kontakt" render={this.contactPage} />
                            <Route path="/ansokan" render={this.applyForMembershipPage} />
							
                            <Route exact path="/inloggad/" render={this.informationPage} />
                            <Route path="/inloggad/medlemmar" render={this.membersPage} />
                            <Route path="/inloggad/kalender" render={this.internalCalendarPage} />
                            <Route path="/inloggad/dokument" render={this.documentsPage} />
							
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
		// TODO: Save session logged in state
        console.log('Success: ', response);
        var profile = response.additionalUserInfo.profile;
		this.setState({
			loggedIn: true,
			user: new User(profile.given_name,
							profile.family_name,
							profile.email,
                            profile.id,
                            profile.picture)
		});
		// Redirect user?
	}
	handleLoginFailure(response) {
		// TODO: Show error message
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
		// TODO: Redirect user
	}

    // Internal pages
    informationPage() {
        return this.state.loggedIn 
            ? (<Information loggedIn={this.state.loggedIn} user={this.state.user} />)
            : (<RequiresLogin />);
    }
    internalCalendarPage() {
        return this.state.loggedIn 
            ? (<InternalCalendar loggedIn={this.state.loggedIn} user={this.state.user} />)
            : (<RequiresLogin />);
    }
    documentsPage() {
        return this.state.loggedIn 
            ? (<Documents loggedIn={this.state.loggedIn} user={this.state.user} />)
            : (<RequiresLogin />);
    }
    membersPage() {
        return this.state.loggedIn 
            ? (<Members loggedIn={this.state.loggedIn} user={this.state.user} />)
            : (<RequiresLogin />);
    }

    // External pages
    homePage() {
        return (
            <Home loggedIn={this.state.loggedIn} user={this.state.user} />
        );
    }
    calendarPage() {
        return (
            <Calendar loggedIn={this.state.loggedIn} user={this.state.user} />
        );
    }
    contactPage() {
        return (
            <Contact loggedIn={this.state.loggedIn} user={this.state.user} />
        );
    }
    applyForMembershipPage() {
        return (
            <ApplyForMembership loggedIn={this.state.loggedIn} user={this.state.user} />
        );
    }
}

export default Main;