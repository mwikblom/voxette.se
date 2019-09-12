import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FirebaseApp from '../../FirebaseApp';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { Redirect } from 'react-router-dom';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    MenuItem,
    Tooltip,
    Chip,
    CircularProgress
} from '@material-ui/core/';

// TODO byt namn till Files.js

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        padding: theme.spacing.unit * 2,
        flexGrow: 1
    },
    table: {
        minWidth: 700,
    },
    buttonCell: {
        width: '35px',
        paddingRight: '0',
        paddingLeft: '10px'
    },
    button: {
        margin: theme.spacing.unit,
        float: 'right'
    }, 
    input: {
        display: 'none',
    },
    textField: {
        width: '100%',
    },
    action: {
        cursor: 'pointer'
    },
    chipRoot: {
        whiteSpace: 'nowrap',
    },    
    chip: {
        margin: theme.spacing.unit / 2,
    },      
    buttonProgress: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -83,
        marginLeft: 149,
      },
});

// TODO duplicated in File.js
const tagValues = [
    'Noter',
    'Bilder',
    'Ljudfiler',
    'Dokument',
    'Aktuellt',
    'Övrigt'
];

function humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function fileUri(fullPath) {
    return '/inloggad/fil/' + fullPath;
}

function downloadFileUri(fullPath) {
    return '/inloggad/ladda-ned/' + fullPath;
}

class Documents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            filterName: '',
            filterTag: '',
            selectedFullPath: null,
            loading: false,
            disabled: false
        };
    }

    search(e) {
        const { filterName, filterTag } = this.state;

        e.preventDefault();

        if (!filterName && !filterTag) {
            return;
        }
        this.setState({
            loading: true,
            disabled: true
        })

        FirebaseApp.voxette.fetchFiles(filterName, filterTag, (files) => {
            if (files) {
                this.setState({
                    files: files
                });
            }
            this.setState({
                loading: false,
                disabled: false
            });
        });
    }

    handleFiles(event) {
        const files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            const marker = FirebaseApp.voxette.getValidDatabasePathItem(file.name);
            const fullPath = new Date().getTime() + '_' + marker;

            FirebaseApp.voxette.uploadFile(fullPath, file, (data) => { 

                const newFiles = this.state.files.splice(0);

                newFiles.unshift(data);

                this.setState({
                    files: newFiles
                });
            });
        }            
    }

    render() {
        const { classes } = this.props;
        const { files, filterName, filterTag, editable, selectedFullPath, loading, disabled } = this.state;

        const searchDisabled = disabled || (!filterName && !filterTag);

        const nameField = function(file) {
            return ((editable && editable === file.fullPath) ? <strong>{file.name}</strong> : file.name)
        }

        if (selectedFullPath) {
            return <Redirect push to={fileUri(selectedFullPath)}/>;
        }

        return (
            <div>
                <h1>Filer</h1>
                <p>
                    Här kan du hitta noter, stämfiler och annat. Du kan söka genom att klicka på sökknappen; då listas samtliga filer.
                    Du kan även begränsa sökningen genom att ange första delen av filnamnet, exemelvis hittas
                    DotterSion.pdf genom att ange 'do'. Det är också möjligt att begränsa sökningen genom att filtrera på en 'typ', exempelvis 
                    noter och ljudfiler.
                </p>
                <p>
                    För att lägga till nya filer använder du den gröna knappen med plus. PDF-filer kommer automatiskt taggas som noter, audio-format 
                    såsom MP3 taggas som ljudfiler och bild-format som bilder. Övriga filtyper taggas som övrigt. När filen är uppladdad kan du llicka 
                    på pennan om du vill ändra filens namn eller byta tagg.
                </p>

                <Paper className={classes.root}>

                    <input
                        accept="*/*"
                        className={classes.input}
                        id="upload-input"
                        multiple
                        type="file"
                        onChange={(event) => this.handleFiles(event)} 
                    />
                    <label htmlFor="upload-input">
                        <Tooltip title="Lägg till nya filer">
                            <Button variant="fab" component="span" color="secondary" aria-label="add" className={classes.button}>
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </label>    

                    <div>                     
                        <form onSubmit={(e) => this.search(e)}>
                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="name"
                                        label="Namn"
                                        className={classes.textField}
                                        value={filterName}
                                        onChange={(event) => this.handleChange(event, 'filterName')}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="type"
                                        select
                                        label="Typ"
                                        className={classes.textField}
                                        value={filterTag}
                                        onChange={(event) => this.handleChange(event, 'filterTag')}
                                        SelectProps={{
                                            MenuProps: {
                                                className: classes.menu,
                                            },
                                        }}
                                        margin="normal"
                                    >
                                        <MenuItem value="">
                                            <em>Alla</em>
                                        </MenuItem>
                                        {tagValues.map(tag => (
                                            <MenuItem key={tag} value={tag}>
                                                {tag}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Tooltip title="Sök efter filer">              
                                <Button type="submit" variant="contained" disabled={searchDisabled} color="primary">
                                    <SearchIcon />
                                </Button>
                            </Tooltip>
                            {loading && <CircularProgress size={40} className={classes.buttonProgress} />}
                        </form>
                    </div>

                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.buttonCell}></TableCell>
                                <TableCell>Namn</TableCell>
                                <TableCell>Taggar</TableCell>
                                <TableCell>Storlek</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map(file => {
                                return (
                                    <TableRow hover key={file.fullPath}>
                                        <TableCell className={classes.buttonCell}>
                                            <Tooltip title="Öppna fil">
                                                <a href={downloadFileUri(file.fullPath)} target="_blank">
                                                    <CloudDownloadIcon className={classes.action} />
                                                </a>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {nameField(file)}
                                        </TableCell>
                                        <TableCell className={classes.chipRoot}>
                                            {file.tags && file.tags.map(tag => {
                                                return (
                                                    <Chip
                                                        key={tag}
                                                        label={tag}
                                                        className={classes.chip}
                                                    />
                                                );        
                                            })}
                                        </TableCell>
                                        <TableCell>{humanFileSize(file.size)}</TableCell>
                                        <TableCell>  
                                            <Tooltip title="Ändra namn eller filens taggar">
                                                <EditIcon className={classes.action} onClick={() => this.handleClickEdit(file.fullPath)}/>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>                   
            </div>
        );
    }

    handleChange(event, name) {
        this.setState({
            [name]: event.target.value
        });
    }   

    // handleClickDownload = fullPath => {
        // FirebaseApp.voxette.getDownloadUrl(fullPath, (url) => {
        //     window.open(url); // just open in new tab for now. Might be better to download due to bandwidth

        //     /*var xhr = new XMLHttpRequest();
        //     xhr.responseType = 'blob';
        //     xhr.onload = function(event) {
        //         var blob = xhr.response;

        //     };
        //     xhr.open('GET', url);
        //     xhr.send();*/
        // });
    // }

    handleClickEdit = fullPath => {
        this.setState({
            selectedFullPath: fullPath
        });
    }
}

Documents.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Documents);