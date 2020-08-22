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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Constants from './../../common/Constants';

const styles = theme => ({
    paper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        padding: theme.spacing.unit * 2
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
    },
    formControl: {
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
    formDropdown: {
        marginTop: theme.spacing.unit * 2
    }
});

// TODO duplicated in Files.js
function humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

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

class File extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            hasChanges: false,
            name: '',
            size: '',
            type: '',
            fileType: '',
            isCurrent: false,
            tags: [],
            categories: [],
            allCategories: [],
            allTags: []
        };
    }

    componentWillMount() {
        console.log(this.props);
        const { fullPath } = this.props;

        FirebaseApp.voxette.fetchFileData(fullPath, (fileData) => {
            if (fileData) {
                this.setState(fileData);
                this.setState({
                    hasChanges: false
                });
            }
        });

        // TODO: Get these from db
        this.setState({
            allCategories: [
                'Fest',
                'Jul',
                'Lucia',
                'Sommar',
                'Valborg',
                'Världens barn'
            ],
            allTags: [
                'HT20 Världens barn',
                'HT20 Lucia',
                'HT20 Julpaket 1',
                'HT20 Julpaket 2',
                'Valborg',
                'VT21 Disco',
                'VT21 Nationaldag'
            ]
        });
    }

    render() {
        const { classes } = this.props;
        const {
            name,
            size,
            type,
            fileType, 
            isCurrent,
            tags,
            categories,
            hasChanges,
            allCategories,
            allTags
        } = this.state;

        return (            
            <div>
                <Paper className={classes.paper}>
                    <form className={classes.container} noValidate autoComplete="off" onSubmit={(e) => this.saveChanges(e)}>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
                                <FormControl className={`${classes.formControl} ${classes.formDropdown}`}>
                                    <InputLabel htmlFor="file-type-chip">Typ</InputLabel>
                                    <Select
                                        value={fileType}
                                        onChange={(event) => this.handleChange(event, 'fileType')}
                                        MenuProps={MenuProps}
                                    >
                                        {Constants.fileTypes.map(fileType => (
                                            <MenuItem
                                                key={fileType}
                                                value={fileType}
                                            >
                                                {fileType}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="categories-chip">Kategorier</InputLabel>
                                    <Select
                                        multiple
                                        value={categories}
                                        onChange={(event) => this.handleChange(event, 'categories')}
                                        input={<Input id="categories-chip" />}
                                        renderValue={selected => (
                                            <div className={classes.chips}>
                                                {selected.map(value => (
                                                    <Chip key={value} label={value} className={classes.chip} />
                                                ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {allCategories.map(category => (
                                            <MenuItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="tags-chip">Taggar</InputLabel>
                                    <Select
                                        multiple
                                        value={tags}
                                        onChange={(event) => this.handleChange(event, 'tags')}
                                        input={<Input id="tags-chip" />}
                                        renderValue={selected => (
                                            <div className={classes.chips}>
                                                {selected.map(value => (
                                                    <Chip key={value} label={value} className={classes.chip} />
                                                ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {allTags.map(tags => (
                                            <MenuItem
                                                key={tags}
                                                value={tags}
                                            >
                                                {tags}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControlLabel
                                    control={<Checkbox checked={isCurrent} onChange={(event) => this.handleCheckedChange(event, 'isCurrent')} />}
                                    label="Aktuell"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    id="size"
                                    label="Storlek"
                                    className={classes.textField}
                                    value={humanFileSize(size)}
                                    margin="normal"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                                    <CancelIcon className={classes.buttonIcon} />
                                    Stäng
                                </Button>
                                <Button className={classes.action} variant="contained" color="primary" disabled={!hasChanges} type="submit">
                                    <SaveIcon className={classes.buttonIcon} />
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

    handleCheckedChange(event, name) {
        this.setState({
            [name]: event.target.checked,
            hasChanges: true
        });
    }

    saveChanges(e) {
        const { fullPath } = this.props;
        const { name, fileType, isCurrent, tags, categories } = this.state;

        e.preventDefault();

        if (name) {
            FirebaseApp.voxette.saveFileData(fullPath, name, fileType, isCurrent, tags, categories, () => {
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