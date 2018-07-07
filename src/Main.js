import React, { Component } from 'react';
import { Route, Switch, NavLink, BrowserRouter } from 'react-router-dom';
import PageController from './pages/PageController';
import FirebaseApp from './FirebaseApp';
import NotFound from './pages/NotFound';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Components
import Authentication from './components/Authentication';
import User from './models/User';
//import { Editor } from '@tinymce/tinymce-react';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: undefined,
            anchorEl: null
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
                <React.Fragment>
                    <MenuItem onClick={this.handleClose}><NavLink exact to="/inloggad/">Information</NavLink></MenuItem>
                    <MenuItem onClick={this.handleClose}><NavLink to="/inloggad/medlemmar">Medlemmar</NavLink></MenuItem>
                    <MenuItem onClick={this.handleClose}><NavLink to="/inloggad/kalender">Kalender</NavLink></MenuItem>
                    <MenuItem onClick={this.handleClose}><NavLink to="/inloggad/dokument">Dokument</NavLink></MenuItem>
                </React.Fragment>
            )
            : undefined;
        
        const { classes } = this.props;
        const { anchorEl } = this.state;

        return (
            <React.Fragment>
                <CssBaseline />
                <BrowserRouter>
                    <div className={classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
                                    aria-owns={anchorEl ? 'simple-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>

                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={this.handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem onClick={this.handleClose}><NavLink exact to="/">Hem</NavLink></MenuItem>
                                    <MenuItem onClick={this.handleClose}><NavLink to="/kalender">Kalender</NavLink></MenuItem>
                                    <MenuItem onClick={this.handleClose}><NavLink to="/kontakt">Kontakt</NavLink></MenuItem>
                                    <MenuItem onClick={this.handleClose}><NavLink to="/ansokan">Ansökan</NavLink></MenuItem>
                                    {internalMenu}
                                </Menu>           

                                <Typography variant="title" color="inherit" className={classes.flex}>
                                    KFUM Voxette
                                </Typography>

                                <Authentication onLoginSuccess={this.handleLoginSuccess}
                                    onLoginFailure={this.handleLoginFailure}
                                    onLogoutSuccess={this.handleLogoutSuccess}
                                    loggedIn={this.state.loggedIn}
                                    user={this.state.user} />
                            </Toolbar>
                        </AppBar>

                        <div>
                            <h1>Välkommen till KFUM Voxette!</h1>

                            <div className="content">
                                <div id="info-message"></div>
                                <Switch>
                                    <Route exact path="/" render={this.pageController.HomePage} />
                                    <Route path="/kalender" render={this.pageController.CalendarPage} />
                                    <Route path="/kontakt" render={this.pageController.ContactPage} />
                                    <Route path="/ansokan" render={this.pageController.ApplyForMembershipPage} />
							
                                    <Route exact path="/inloggad/" render={this.pageController.InformationPage} />
                                    <Route path="/inloggad/medlemmar" render={this.pageController.MembersPage} />
                                    <Route path="/inloggad/medlem/:memberId" render={this.pageController.MemberPage} />
                                    <Route path="/inloggad/kalender" render={this.pageController.InternalCalendarPage} />
                                    <Route path="/inloggad/dokument" render={this.pageController.DocumentsPage} />
							
                                    <Route component={NotFound} />
                                </Switch>
                            </div>
                        </div>		
                    </div>            
                </BrowserRouter>
            </React.Fragment>            
        );
    }
	
    // Functions
    handleLoginSuccess(response) {

        FirebaseApp.voxette.fetchUserData(response.uid, (userData) => {

            if (userData) {

                this.setState({
                    loggedIn: true,
                    user: new User(response.uid, userData)
                });
        
            } else {
                // TODO: redirect to member when no data exists. Prepopulate with data in User
                this.setState({
                    loggedIn: true,
                    user: new User(response.uid,
                        response.displayName,
                        response.email,
                        response.photoURL)
                });
            }
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

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };    
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);