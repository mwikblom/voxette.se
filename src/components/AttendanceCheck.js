import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Grid,
    Radio,
    FormControlLabel,
    Typography
} from '@material-ui/core';
import FirebaseApp from '../FirebaseApp';
import DateTimeHelper from '../common/DateTimeHelper';
import { green, yellow } from '@material-ui/core/colors';

const styles = theme => ({
    title: {
        marginBottom: 0,
        [theme.breakpoints.up('md')]: {
            marginTop: '30px'
        }
    }
});

const GreenRadio = withStyles({
    root: {
        '&$checked': {
            color: green[400],
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

const YellowRadio = withStyles({
    root: {
        '&$checked': {
            color: yellow[600],
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);


class AttendanceCheck extends Component {
    saveAttendance = (e) => {
        const choice = e.target.value;

        const { eventId, selectedUser, onAttendanceChange } = this.props;
        const memberId = selectedUser.memberId;
        let attendance = {
            choice,
            part: selectedUser.part,
            updated: DateTimeHelper.getCurrentTimestamp(),
        };

        FirebaseApp.voxette.addEventAttendance(eventId, memberId, attendance, () => {
            onAttendanceChange(eventId, memberId, attendance);
        });
    }
    render() {
        const {
            classes,
            user,
            selectedUser,
            eventAttendance
        } = this.props;
        const memberId = selectedUser.memberId;
        let currentAttendance = { choice: -1 };
        if (eventAttendance && eventAttendance[memberId]) {
            currentAttendance = eventAttendance[memberId];
        }

        return (
            <Grid item xs={12} sm={4}>
                <h4 className={classes.title}>
                    {
                        user.memberId === selectedUser.memberId
                        ? 'Min närvaro'
                        : `Närvaro för ${selectedUser.firstName} ${selectedUser.lastName}`
                    }
                </h4>
                <Grid container spacing={8}>
                    <Grid item xs={4} sm={6} md={4}>
                        <FormControlLabel
                            value="1"
                            control={<GreenRadio disabled={!selectedUser.part} />}
                            label="Ja"
                            checked={currentAttendance.choice == 1}
                            onChange={this.saveAttendance}
                            name="attendance"
                        />
                    </Grid>
                    <Grid item xs={4} sm={6} md={4}>
                        <FormControlLabel
                            value="0"
                            control={<Radio color="primary" disabled={!selectedUser.part} />}
                            label="Nej"
                            checked={currentAttendance.choice == 0}
                            onChange={this.saveAttendance}
                            name="attendance"
                        />
                    </Grid>
                    <Grid item xs={4} sm={6} md={4}>
                        <FormControlLabel
                            value="2"
                            control={<YellowRadio disabled={!selectedUser.part} />}
                            label="Kanske"
                            checked={currentAttendance.choice == 2}
                            onChange={this.saveAttendance}
                            name="attendance"
                        />
                    </Grid>
                </Grid>
                <Typography variant="caption" component="p">Senast ändrad: {currentAttendance.updated}</Typography>
            </Grid>
        );
    }
}

AttendanceCheck.propTypes = {
    classes: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    eventAttendance: PropTypes.object
};

export default withStyles(styles)(AttendanceCheck);