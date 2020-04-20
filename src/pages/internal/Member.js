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
    Input,
    Avatar,
    IconButton,
    Tooltip
} from '@material-ui/core';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    Delete as DeleteIcon
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Constants from '../../common/Constants';

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
    },
    avatar: {
        width: theme.spacing.unit * 7,
        height: theme.spacing.unit * 7,
        marginBottom: theme.spacing.unit
    },
    avatarContainer: {
        display: 'flex'
    }
});

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
            firstName: '',
            lastName : '',
            email: '',
            phone: '',
            address: '',
            part: '',
            tags: [],
            pictureUrl: '',
            startDate: '',
            allergies: '',
            hasChanges: false
        };
    }

    componentWillMount() {
        const { memberId } = this.props;

        FirebaseApp.voxette.fetchUserData(memberId, (userData) => {
            if (userData) {
                // Default fallback on empty array when the value is being treated as a string.
                if (userData.tags === null || userData.tags === '') {
                    userData.tags = [];
                }
                this.setState({
                    ...userData,
                    hasChanges: false
                });
            }
        });
    }

    handleChange = (event, name) => {
        let value = event.target.value;
        if (name === 'tags' && !value) {
            value = null;
        }
        this.setState({
            [name]: value,
            hasChanges: true
        });
    }   
    
    saveChanges = (e = null) => {
        if (e !== null) {
            e.preventDefault();
        }

        const { memberId } = this.props;
        FirebaseApp.voxette.saveUserData(memberId, this.state, () => {
            this.setState({
                hasChanges: false
            });
        });
    }

    deletePicture = () => {
        this.setState({
            pictureUrl: ''
        }, () => {
            this.saveChanges(null);
        });
    }

    render() {
        const { classes } = this.props;
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            part,
            tags,
            pictureUrl,
            hasChanges,
            startDate,
            allergies
        } = this.state;

        return (            
            <div>
                {
                    pictureUrl
                        ? <div className={classes.avatarContainer}>
                            <Avatar className={classes.avatar} src={pictureUrl} alt={firstName} />
                            <Tooltip title="Ta bort bild">
                                <IconButton onClick={this.deletePicture} color="primary">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        : <Avatar className={classes.avatar}>
                            <PersonIcon />
                        </Avatar>
                }
                <form className={classes.container} noValidate autoComplete="off" onSubmit={this.saveChanges}>
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
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="email"
                                label="Epost"
                                className={classes.textField}
                                value={email}
                                onChange={(event) => this.handleChange(event, 'email')}
                                margin="normal"
                                type="email"
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
                                type="tel"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="part"
                                select
                                label="Stämma"
                                className={classes.textField}
                                value={part}
                                onChange={(event) => this.handleChange(event, 'part')}
                                margin="normal"
                            >
                                <MenuItem value="">
                                    <em>Alla</em>
                                </MenuItem>
                                {Constants.partValues.map(part => (
                                    <MenuItem key={part} value={part}>
                                        {part}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
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
                                    {Constants.tagValues.map(tag => (
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
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="allergies"
                                label="Allergier/matpreferenser"
                                className={classes.textField}
                                value={allergies}
                                onChange={(event) => this.handleChange(event, 'allergies')}
                                margin="normal"
                                multiline
                                rows="3"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <TextField
                                id="startDate"
                                label="Medlem sedan"
                                className={classes.textField}
                                value={startDate}
                                onChange={(event) => this.handleChange(event, 'startDate')}
                                margin="normal"
                                type="date"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                    </Grid>
            
                    <Button component={Link} className={classes.action} variant="outlined" to="/inloggad/medlemmar">
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
}

Member.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    memberId: PropTypes.string.isRequired
};
  
export default withStyles(styles)(Member);