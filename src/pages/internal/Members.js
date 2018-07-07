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

let id = 0;
function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return { id, name, calories, fat, carbs, protein };
}

const data = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: {}
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
        const { members } = this.state;

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
                                <TableCell numeric>Telefon</TableCell>
                                <TableCell numeric>Epost</TableCell>
                                <TableCell numeric>Adress</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.values(members).map(mmeber => {
                                return (
                                    <TableRow key={mmeber.userData.memberId}>
                                        <TableCell component="th" scope="row">
                                            {mmeber.userData.firstName} {mmeber.userData.laastName}
                                        </TableCell>
                                        <TableCell numeric>{mmeber.userData.part}</TableCell>
                                        <TableCell numeric>{mmeber.userData.phone}</TableCell>
                                        <TableCell numeric>{mmeber.userData.email}</TableCell>
                                        <TableCell numeric>{mmeber.userData.address}</TableCell>
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

Members.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Members);