import React, { Component } from 'react';
import { Route, Switch, NavLink, BrowserRouter } from 'react-router-dom';
import PageController from './pages/PageController';
import FirebaseApp from './FirebaseApp';
import NotFound from './pages/NotFound';
import Message from './components/Message';
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
import Paper from '@material-ui/core/Paper';

// Components
import Authentication from './components/Authentication';
import User from './models/User';
//import { Editor } from '@tinymce/tinymce-react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#E8F5E9',
            main: '#C8E6C9',
            dark: '#A5D6A7',
            contrastText: '#000',
        },
        secondary: {
            light: '#FFEBEE',
            main: '#FFCDD2',
            dark: '#EF9A9A',
            contrastText: '#000',
        },    
    }
});

const styles = theme => ({
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
    content: {
        padding: theme.spacing.unit,
        margin: theme.spacing.unit
    },
    navLink: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    }
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: undefined,
            anchorEl: null,
            messageText: undefined,
            messageVariant: 'info'
        };        

        // Functions
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.handleLogoutSuccess = this.handleLogoutSuccess.bind(this);
    }
    render() {
        this.pageController = new PageController(this.state.loggedIn, this.state.user);

        const { classes } = this.props;
        const { anchorEl, messageText, messageVariant } = this.state;

        // Init internal routing
        const internalMenu = this.state.loggedIn
            ? (
                <React.Fragment>
                    <MenuItem onClick={this.handleClose}><NavLink className={classes.navLink} to="/inloggad/medlemmar">Medlemmar</NavLink></MenuItem>
                    <MenuItem onClick={this.handleClose}><NavLink className={classes.navLink} to="/inloggad/kalender">Intern kalender</NavLink></MenuItem>
                    <MenuItem onClick={this.handleClose}><NavLink className={classes.navLink} to="/inloggad/filer">Filer</NavLink></MenuItem>
                </React.Fragment>
            )
            : undefined;

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Message text={messageText} variant={messageVariant} />                
                <BrowserRouter>
                    <div className={classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton 
                                    className={classes.menuButton} 
                                    color="inherit" 
                                    aria-label="Menu"
                                    aria-owns={anchorEl ? 'simple-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
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
                                    <MenuItem onClick={this.handleClose}>
                                        <NavLink className={classes.navLink} exact to="/">Hem</NavLink>
                                    </MenuItem>
                                    <MenuItem onClick={this.handleClose}>
                                        <NavLink className={classes.navLink} exact to="/dirigent">Dirigent</NavLink>
                                    </MenuItem>
                                    <MenuItem onClick={this.handleClose}>
                                        <NavLink className={classes.navLink} to="/kontakt">Kontakt</NavLink>
                                    </MenuItem>
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

                        <Paper className={classes.content}>
                            <div id="info-message"></div>
                            <Switch>
                                <Route exact path="/" render={this.pageController.HomePage} />
                                <Route path="/kalender" render={this.pageController.CalendarPage} />
                                <Route path="/kontakt" render={this.pageController.ContactPage} />
                                <Route path="/ansokan" render={this.pageController.ApplyForMembershipPage} />
                                <Route path="/dirigent" render={this.pageController.Conductor} />
                        
                                <Route exact path="/inloggad/" render={this.pageController.InformationPage} />
                                <Route path="/inloggad/medlemmar" render={this.pageController.MembersPage} />
                                <Route path="/inloggad/medlem/:memberId" render={this.pageController.MemberPage} />
                                <Route path="/inloggad/kalender" render={this.pageController.InternalCalendarPage} />
                                <Route path="/inloggad/filer" render={this.pageController.DocumentsPage} />
                                <Route path="/inloggad/fil/:fullPath" render={this.pageController.FilePage} />
                        
                                <Route component={NotFound} />
                            </Switch>
                        </Paper>
                    </div>
                </BrowserRouter>
            </MuiThemeProvider>
        );
    }
	
    // Functions
    handleLoginSuccess(response) {

        const email = response.email;
        const googleId = response.uid;
        const picture = response.photoURL;

        FirebaseApp.voxette.fetchUserData(email, (userData) => {

            if (userData) {

                // first login - generate the user data
                if (userData.googleId) {
                    this.setState({
                        loggedIn: true,
                        user: new User(googleId, userData, email, picture),
                        messageText: 'Du är nu inloggad!',
                        messageVariant: 'success'
                    });
                } else {
                    const user = new User(googleId, response.displayName, email, picture);
                    const initialUserData = user.InitialUserData;

                    FirebaseApp.voxette.saveUserData(userData.memberId, initialUserData, () => {
                        this.setState({
                            loggedIn: true,
                            user: user,
                            messageText: 'Skapade användare för ' + user.FirstName,
                            messageVariant: 'info'
                        });
                    });
                }
            } else {
                this.setState({
                    loggedIn: false,
                    user: undefined,
                    messageText: 'Hoppsan! Användare ' + email + ' saknas',
                    messageVariant: 'warning'
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