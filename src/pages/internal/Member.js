import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
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

class Member extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            memberId: props.memberId,
            firstName : null,
            lastName : null,
            email: null,
            phone: null,
            address: null
        };
    }

    render() {
        const { classes } = this.props;
        const { memberId, firstName, lastName, email, phone, address} = this.state;

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
                                    onChange={this.handleChange('firstName')}
                                    margin="normal"
                                />
                                <TextField
                                    id="lastName"
                                    label="Efternamn"
                                    className={classes.textField}
                                    value={lastName}
                                    onChange={this.handleChange('lastName')}
                                    margin="normal"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    label="Epost"
                                    className={classes.textField}
                                    value={email}
                                    onChange={this.handleChange('email')}
                                    margin="normal"
                                    keyboardType="email-address"
                                />
                                <TextField
                                    id="phone"
                                    label="Mobil"
                                    className={classes.textField}
                                    value={phone}
                                    onChange={this.handleChange('phone')}
                                    margin="normal"
                                    keyboardType="phone-pad"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="address"
                                    label="Adress"
                                    className={classes.textField}
                                    value={address}
                                    onChange={this.handleChange('address')}
                                    margin="normal"
                                    multiline
                                    rows="3"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={this.saveChanges} color="primary">
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

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };    
}

Member.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    memberId: PropTypes.string.isRequired
};
  
export default withStyles(styles)(Member);