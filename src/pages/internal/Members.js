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

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

function memberUri(memberId) {
    return '/inloggad/medlem/' + memberId;
}

class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            selectedMemberId: null
        };
    }

    componentWillMount() {
        FirebaseApp.voxette.fetchAllMembers((members) => {
            if (members) {
                this.setState({
                    members: members
                });
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { members, selectedMemberId } = this.state;

        if (selectedMemberId) {
            return <Redirect push to={memberUri(selectedMemberId)}/>;
        }

        return ( 
            <div>
                <h2>Medlemmar</h2>
                <p>Visar inloggade medlemmens uppgifter samt listar alla medlemmar i kören.</p>
                
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Namn</TableCell>
                                <TableCell>Stämma</TableCell>
                                <TableCell>Telefon</TableCell>
                                <TableCell>Epost</TableCell>
                                <TableCell>Adress</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members.map(member => {
                                return (
                                    <TableRow hover key={member.userData.memberId} onClick={() => this.handleClick(member.userData.memberId)}>
                                        <TableCell component="th" scope="row">
                                            {member.userData.firstName} {member.userData.lastName}
                                        </TableCell>
                                        <TableCell>{member.userData.part}</TableCell>
                                        <TableCell>{member.userData.phone}</TableCell>
                                        <TableCell>{member.userData.email}</TableCell>
                                        <TableCell>{member.userData.address}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>            
            </div>
        );
    }

    handleClick = memberId => {
        this.setState({
            selectedMemberId: memberId
        });
    }
}

Members.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Members);