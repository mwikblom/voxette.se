import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Grid,
    RadioGroup,
    Radio,
    FormControl,
    FormControlLabel,
    Typography
} from '@material-ui/core';
import FirebaseApp from '../FirebaseApp';
import DateTimeHelper from '../common/DateTimeHelper';

const styles = theme => ({
});

class AttendanceCheck extends Component {
    componentWillMount() {
        const { user } = this.props;
        const memberId = FirebaseApp.voxette.getValidDatabasePathItem(user.email);
        console.log('member: ', memberId);
    }
    saveAttendance = (e) => {
        const choice = e.target.value;
        console.log(choice);

        const { eventId, eventAttendance, user, onAttendanceChange } = this.props;
        const memberId = FirebaseApp.voxette.getValidDatabasePathItem(user.email);
        let attendance = {
            choice,
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
            eventId,
            eventAttendance
        } = this.props;
        const memberId = FirebaseApp.voxette.getValidDatabasePathItem(user.email);
        let currentAttendance = { choice: -1 };
        if (eventAttendance && eventAttendance[memberId]) {
            currentAttendance = eventAttendance[memberId];
        }

        return (
            <Grid item xs={12} sm={3}>
                <RadioGroup
                    aria-label="Närvaro"
                    name="attendance"
                    value={`${currentAttendance.choice}`}
                    onChange={this.saveAttendance}
                >
                    {/* <Grid container spacing={24}> */}
                        {/* <Grid item xs="auto"> */}
                            <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Ja"
                            />
                        {/* </Grid> */}
                        {/* <Grid item xs="auto"> */}
                            <FormControlLabel
                                value="0"
                                control={<Radio color="primary" />}
                                label="Nej"
                            />
                        {/* </Grid> */}
                        {/* <Grid item xs="auto"> */}
                            <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Kanske"
                            />
                        {/* </Grid> */}
                    {/* </Grid> */}
                </RadioGroup>
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