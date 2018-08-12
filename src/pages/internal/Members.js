import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FirebaseApp from '../../FirebaseApp';
import { Redirect } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
    action: {
        cursor: 'pointer',
        marginRight: theme.spacing.unit * 3
    } 
});

// TODO duplicated in Member
const parts = [
    {
        value: '',
        label: 'Alla',
    },
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
        value: 'Alt 2',
        label: 'Alt 2',
    },
];

function memberUri(memberId) {
    return '/inloggad/medlem/' + memberId;
}

class Members extends Component {

    constructor(props) {
        super(props);

        this.state = {
            members: [],
            selectedMemberId: null,
            filterName: '',
            filterPart: '',
            addOpen: false,
            newMemberEmail: ''
        };
    }

    search(e) {
        const { filterName, filterPart } = this.state;

        e.preventDefault();

        FirebaseApp.voxette.fetchMembers(filterName, filterPart, (members) => {
            if (members) {
                this.setState({
                    members: members
                });
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { members, selectedMemberId, filterName, filterPart, addOpen } = this.state;

        if (selectedMemberId) {
            return <Redirect push to={memberUri(selectedMemberId)}/>;
        }

        return ( 
            <div>
                <h1>Medlemmar</h1>
                <p>Här kan du lista körens medlemmar. Sökning sker från början av förnamnet och är "case sensitive" dvs. 'A' hittar Anna.</p>
                
                <Paper className={classes.root}>

                    <Button variant="fab" component="span" color="primary" aria-label="add" className={classes.button} onClick={this.handleClickOpen}>
                        <AddIcon/>
                    </Button>

                    <Dialog
                        open={addOpen}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                        >
                        <DialogTitle id="form-dialog-title">Ny medlem</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            Lägg till epost till den nya medlemmen. Eposten måste överensstämma med den inloggningsmetod som ska användas.
                            Om exemelvis gmail används som inloggning måste det vara en gmail-adress.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Email"
                                type="email"
                                fullWidth
                                onChange={(event) => this.handleChange(event, 'newMemberEmail')}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose}>
                            Avbryt
                            </Button>
                            <Button onClick={this.handleClose} color="primary">
                            Lägg till
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <div>                     
                        <form onSubmit={(e) => this.search(e)}>
                            <TextField
                                id="name"
                                label="Förnamn"
                                className={classes.textField}
                                value={filterName}
                                onChange={(event) => this.handleChange(event, 'filterName')}
                                margin="normal"
                            />
                            <TextField
                                id="part"
                                select
                                label="Stämma"
                                className={classes.textField}
                                value={filterPart}
                                onChange={(event) => this.handleChange(event, 'filterPart')}
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
                            <Button type="submit" variant="contained">
                                <SearchIcon />
                            </Button>
                        </form>
                    </div>

                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Namn</TableCell>
                                <TableCell>Stämma</TableCell>
                                <TableCell>Telefon</TableCell>
                                <TableCell>Epost</TableCell>
                                <TableCell>Adress</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members.map(member => {
                                return (
                                    <TableRow hover key={member.userData.memberId}>
                                        <TableCell component="th" scope="row">
                                            {member.userData.firstName} {member.userData.lastName}
                                        </TableCell>
                                        <TableCell>{member.userData.part}</TableCell>
                                        <TableCell>{member.userData.phone}</TableCell>
                                        <TableCell>{member.userData.email}</TableCell>
                                        <TableCell>{member.userData.address}</TableCell>
                                        <TableCell>
                                            <EditIcon className={classes.action} onClick={() => this.handleClick(member.userData.memberId)}/>
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

    handleClickOpen = () => {
        this.setState({ addOpen: true });
    }
    
    handleClose = () => {
        const { newMemberEmail } = this.state; 

        if (!newMemberEmail) {
            this.setState({ addOpen: false });
        }

        FirebaseApp.voxette.addMember(newMemberEmail, () => {
            this.setState({ 
                addOpen: false,
                newMemberEmail: ''
             });
        });
    }
      
    handleClick = memberId => {
        this.setState({
            selectedMemberId: memberId
        });
    }

    handleChange(event, name) {
        this.setState({
            [name]: event.target.value
        });
    }   
}

Members.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Members);