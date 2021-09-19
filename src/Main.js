import React, { Component } from 'react';
import { Route, Switch, NavLink, BrowserRouter } from 'react-router-dom';
import PageController from './pages/PageController';
import FirebaseApp from './FirebaseApp';
import NotFound from './pages/NotFound';
import Message from './components/Message';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    CssBaseline,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    Divider
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Authentication from './components/Authentication';
import User from './models/User';
import MenuItemLink from './components/MenuItemLink';
//import { Editor } from '@tinymce/tinymce-react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#ff9f99',
            main: '#e5263e', // red
            dark: '#450702',
            contrastText: '#fff',
        },
        secondary: {
            light: '#00afde',
            main: '#0069b2', // blue
            dark: '#0a1b3f',
            contrastText: '#fff',
        },
        text: {
            primary: '#0a1b3f',
            secondary: '#0a1b3f'
        }
    },
    overrides: {
        MuiTableCell: {
            root: {
                padding: '4px 24px'
            }
        }
    }
});

const styles = theme => ({
    titleLink: {
        color: 'inherit',
        textDecoration: 'none',
        display: 'flex'
    },
    title: {
        flex: 1,
        fontSize: '20px'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    content: {
        padding: theme.spacing.unit,
        margin: `${theme.spacing.unit}px auto`,
        maxWidth: '1200px'
    },
    navLink: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        display: 'block',
        maxWidth: '100%',
        width: '250px'
    },
    logo: {
        background: '#fff',
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 2}px`,
        width: '100%',
        minWidth: '65px'
    },
    logoContainer: {
        maxWidth: '104px',
        height: 'auto',
        marginRight: theme.spacing.unit * 4,
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    }
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: undefined,
            anchorEl: null,
            //messageText: 'Den här sidan är under uppbyggnad!',
            messageVariant: 'info',
            updatedPicture: undefined
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
                    <Divider />
                    <MenuItemLink className={classes.navLink} to="/inloggad/medlemmar">Medlemmar</MenuItemLink>
                    <MenuItemLink className={classes.navLink} to="/inloggad/kalender">Intern kalender</MenuItemLink>
                    <MenuItemLink className={classes.navLink} to="/inloggad/filer">Filer</MenuItemLink>
                </React.Fragment>
            )
            : undefined;

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Message text={messageText} variant={messageVariant} />                
                <BrowserRouter>
                    <div>
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
                                    onClick={this.handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItemLink className={classes.navLink} exact to="/">Hem</MenuItemLink>
                                    <MenuItemLink className={classes.navLink} to="/dirigent">Dirigent</MenuItemLink>
                                    <MenuItemLink className={classes.navLink} to="/kontakt">Kontakt</MenuItemLink>
                                    {internalMenu}
                                </Menu>
                                
                                <NavLink className={`${classes.titleLink} ${classes.logoContainer}`} exact to="/">
                                    <img src="/images/KFUM-voxette.png" className={classes.logo} alt="KFUM Örebro Voxette, logga" />
                                </NavLink>
                                <h1 className={classes.title}>
                                    <NavLink className={classes.titleLink} exact to="/">KFUM Voxette</NavLink>
                                </h1>
                                <Authentication onLoginSuccess={this.handleLoginSuccess}
                                    onLoginFailure={this.handleLoginFailure}
                                    onLogoutSuccess={this.handleLogoutSuccess}
                                    loggedIn={this.state.loggedIn}
                                    user={this.state.user}
                                    updatedPicture={this.state.updatedPicture} />
                            </Toolbar>
                        </AppBar>

                        <div className={classes.content}>
                            <div id="info-message"></div>
                            <Switch>
                                <Route exact path="/" render={this.pageController.HomePage} />
                                <Route path="/kalender" render={this.pageController.CalendarPage} />
                                <Route path="/kontakt" render={this.pageController.ContactPage} />
                                <Route path="/ansokan" render={this.pageController.ApplyForMembershipPage} />
                                <Route path="/dirigent" render={this.pageController.Conductor} />
                                <Route path="/gdpr" render={this.pageController.GDPR} />
                        
                                <Route exact path="/inloggad/" render={this.pageController.InformationPage} />
                                <Route path="/inloggad/medlemmar" render={this.pageController.MembersPage} />
                                <Route path="/inloggad/medlem/:memberId" render={this.pageController.MemberPage} />
                                <Route path="/inloggad/kalender" render={this.pageController.InternalCalendarPage} />
                                <Route path="/inloggad/filer" render={this.pageController.FilesPage} />
                                <Route path="/inloggad/ladda-ned/:fullPath" render={this.pageController.DownloadFilePage} />
                                <Route path="/inloggad/fil/:fullPath" render={this.pageController.FilePage} />
                        
                                <Route component={NotFound} />
                            </Switch>
                        </div>
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

                if (userData.googleId) {
                    this.setState({
                        loggedIn: true,
                        user: new User(googleId, userData, email, picture),
                        messageText: 'Du är nu inloggad!',
                        messageVariant: 'success',
                        updatedPicture: picture
                    });
                } else {
                    // first login - generate the user data
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
    
    handleLoginFailure(error) {
        this.setState({
            loggedIn: false,
            user: undefined,
            messageText: `Inloggningen misslyckades: ${error.message}`,
            messageVariant: 'warning'
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
