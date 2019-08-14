import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import { 
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    Select,
    Chip,
    InputLabel,
    Input
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from 'react-router-dom';

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
        width: '100%',
    },
    action: {
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 1.5,
        marginTop: theme.spacing.unit * 1.5
    },
    formControl: {
        marginTop: theme.spacing.unit,
        width: '100%'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    buttonIcon: {
        marginRight: theme.spacing.unit
    }
});

const tagValues = [
    'Sopran 1',
    'Sopran 2',
    'Alt 1',
    'Alt 2',
    'Styrelsemedlem',
    'Dirigent',
    'Admin',
    'Kassör',
    'Inaktiv'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class Member extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            firstName : '',
            lastName : '',
            email: '',
            phone: '',
            address: '',
            tags: [],
            hasChanges: false
        };
    }

    componentWillMount() {
        const { memberId } = this.props;

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
        const { firstName, lastName, email, phone, address, tags, hasChanges} = this.state;

        return (            
            <div>
                <form className={classes.container} noValidate autoComplete="off" onSubmit={(e) => this.saveChanges(e)}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="firstName"
                                label="Förnamn"
                                className={classes.textField}
                                value={firstName}
                                onChange={(event) => this.handleChange(event, 'firstName')}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="lastName"
                                label="Efternamn"
                                className={classes.textField}
                                value={lastName}
                                onChange={(event) => this.handleChange(event, 'lastName')}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="email"
                                label="Epost"
                                className={classes.textField}
                                value={email}
                                onChange={(event) => this.handleChange(event, 'email')}
                                margin="normal"
                                keyboardType="email-address"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
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
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6} lg={4}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-multiple-chip">Taggar</InputLabel>
                                <Select
                                    multiple
                                    value={tags}
                                    onChange={(event) => this.handleChange(event, 'tags')}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={selected => (
                                        <div className={classes.chips}>
                                            {selected.map(value => (
                                                <Chip key={value} label={value} className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {tagValues.map(tag => (
                                        <MenuItem
                                            key={tag}
                                            value={tag}
                                        >
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
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
                    </Grid>
            
                    <Button component={Link} className={classes.action} variant="contained" to="/inloggad/medlemmar">
                        <CancelIcon className={classes.buttonIcon} />
                        Stäng
                    </Button>
                    <Button variant="contained" color="primary" disabled={!hasChanges} className={classes.action} type="submit">
                        <SaveIcon className={classes.buttonIcon} />
                        Spara ändringar
                    </Button>
                </form>
            </div>
        );
    }

    handleChange(event, name) {
        this.setState({
            [name]: event.target.value,
            hasChanges: true
        });
    }   
    
    saveChanges(e) {
        const { memberId } = this.props;

        e.preventDefault();

        FirebaseApp.voxette.saveUserData(memberId, this.state, () => {
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