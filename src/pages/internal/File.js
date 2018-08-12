import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
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
    action: {
        marginRight: theme.spacing.unit * 3,
    }
});

// TODO duplicated in Documents.js
function humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

class File extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            hasChanges: false,
            name: '',
            size: '',
            type: ''
        };
    }

    componentWillMount() {
        const { fullPath } = this.props;

        FirebaseApp.voxette.fetchFileData(fullPath, (fileData) => {
            if (fileData) {
                this.setState(fileData);
                this.setState({
                    hasChanges: false
                });
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { name, size, type, hasChanges } = this.state;

        return (            
            <div>
                <Paper className={classes.paper}>
                    <form className={classes.container} noValidate autoComplete="off" onSubmit={(e) => this.saveChanges(e)}>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <TextField
                                    id="name"
                                    label="Namn"
                                    className={classes.textField}
                                    value={name}
                                    error={!name}
                                    onChange={(event) => this.handleChange(event, 'name')}
                                    margin="normal"
                                    autoFocus
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="size"
                                    label="Storlek"
                                    className={classes.textField}
                                    value={humanFileSize(size)}
                                    margin="normal"
                                    disabled
                                />
                                <TextField
                                    id="type"
                                    label="Typ"
                                    className={classes.textField}
                                    value={type}
                                    margin="normal"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button component={Link} className={classes.action} variant="contained" to="/inloggad/filer">
                                    <CancelIcon />
                                    Stäng
                                </Button>
                                <Button className={classes.action} variant="contained" color="primary" disabled={!hasChanges} type="submit">
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
    
    saveChanges(e) {
        const { fullPath } = this.props;
        const { name } = this.state;

        e.preventDefault();

        if (name) {
            FirebaseApp.voxette.saveFileData(fullPath, name, () => {
                this.setState({
                    hasChanges: false
                });
            });
        }
    }
}

File.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    fullPath: PropTypes.string.isRequired
};
  
export default withStyles(styles)(File);