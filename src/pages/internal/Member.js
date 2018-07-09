import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    paper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },    
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

const parts = [
    {
        value: 'Sopran 1',
        label: 'Sopran 1',
    },
    {
        value: 'Sopran 2',
        label: 'Sopran 2',
    },
    {
        value: 'Alt 1',
        label: 'Alt 1',
    },
    {
        value: 'Alt2',
        label: 'Alt2',
    },
];

class Member extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            memberId: props.memberId,
            firstName : '',
            lastName : '',
            email: '',
            phone: '',
            address: '',
            part: '',
            hasChanges: false
        };
    }

    componentWillMount() {
        const { memberId } = this.state;

        FirebaseApp.voxette.fetchUserData(memberId, (userData) => {
            if (userData) {
                this.setState(userData);
                this.setState({
                    hasChanges: false
                });
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { memberId, firstName, lastName, email, phone, address, part, hasChanges} = this.state;

        return (            
            <div>
                <h2>ID: {memberId}</h2>
                <Paper className={classes.paper}>
                    <form className={classes.container} noValidate autoComplete="off">
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <TextField
                                    id="firstName"
                                    label="Förnamn"
                                    className={classes.textField}
                                    value={firstName}
                                    onChange={(event) => this.handleChange(event, 'firstName')}
                                    margin="normal"
                                />
                                <TextField
                                    id="lastName"
                                    label="Efternamn"
                                    className={classes.textField}
                                    value={lastName}
                                    onChange={(event) => this.handleChange(event, 'lastName')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    label="Epost"
                                    className={classes.textField}
                                    value={email}
                                    onChange={(event) => this.handleChange(event, 'email')}
                                    margin="normal"
                                    keyboardType="email-address"
                                />
                                <TextField
                                    id="phone"
                                    label="Mobil"
                                    className={classes.textField}
                                    value={phone}
                                    onChange={(event) => this.handleChange(event, 'phone')}
                                    margin="normal"
                                    keyboardType="phone-pad"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="part"
                                    select
                                    label="Select"
                                    className={classes.textField}
                                    value={part}
                                    onChange={(event) => this.handleChange(event, 'part')}
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    margin="normal"
                                >
                                    {parts.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    id="address"
                                    label="Adress"
                                    className={classes.textField}
                                    value={address}
                                    onChange={(event) => this.handleChange(event, 'address')}
                                    margin="normal"
                                    multiline
                                    rows="3"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={() => this.saveChanges()} color="primary" disabled={!hasChanges}>
                                    <SaveIcon />
                                    Spara ändringar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </div>
        );
    }

    handleChange(event, name) {
        this.setState({
            [name]: event.target.value,
            hasChanges: true
        });
    }   
    
    saveChanges() {
        FirebaseApp.voxette.saveUserData(this.state.memberId, this.state, () => {
            this.setState({
                hasChanges: false
            });
        });
    }
}

Member.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    memberId: PropTypes.string.isRequired
};
  
export default withStyles(styles)(Member);