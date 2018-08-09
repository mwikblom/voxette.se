import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FirebaseApp from '../../FirebaseApp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
    }, 
    input: {
        display: 'none',
    },       
});

class Documents extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            files: [] 
        };
    }

    componentWillMount() {
        FirebaseApp.voxette.fetchAllFiles((files) => {
            if (files) {
                this.setState({
                    files: files
                });
            }
        });
    }

    handleFiles(event) {
        const files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            const invalidChars = /[.#$]/gi; // TODO also remove [ and ]
            const marker = file.name.replace(invalidChars, '_');
            const fullPath = new Date().getTime() + '_' + marker;

            FirebaseApp.voxette.uploadFile(fullPath, file, () => { // TODO update state after last file
                FirebaseApp.voxette.fetchAllFiles((files) => {
                    if (files) {
                        this.setState({
                            files: files
                        });
                    }
                });
            });
        }            
    }

    render() {
        const { classes } = this.props;
        const { files } = this.state;

        return (
            <div>
                <h2>Filer</h2>
                <p>Här kan du hitta noter och stämfiler</p>

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
                        <Button variant="fab" component="span" color="primary" aria-label="add" className={classes.button}>
                            <AddIcon />
                        </Button>
                    </label>    

                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Namn</TableCell>
                                <TableCell>Storlek</TableCell>
                                <TableCell>Typ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.values(files).map(file => {
                                return (
                                    <TableRow hover key={file.fullPath}>
                                        <TableCell component="th" scope="row">
                                            {file.name}
                                        </TableCell>
                                        <TableCell>{file.size}</TableCell>
                                        <TableCell>{file.type}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>                   
            </div>
        );
    }
}

Documents.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Documents);