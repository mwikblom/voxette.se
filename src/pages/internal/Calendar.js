import React, { Component, Fragment } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import CalendarEventForm from './CalendarEventForm';
import CalendarItem from '../../components/CalendarItem';
import { Button, Tooltip, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AttendanceCheck from '../../components/AttendanceCheck';

const styles = {
    buttonRight: {
        float: 'right',
        marginRight: '10px'    
    }
};

export default withStyles(styles)(class InternalCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: {},
            showForm: false,
            selectedEvent: null
        };
    }

    componentWillMount() {
        FirebaseApp.voxette.fetchAllEvents((events) => {
            if (events) {
                this.setState({
                    events
                });
            }
        });
    }

    handleToggleEventForm = (openForm, eventId = undefined, event = undefined) => {
        var isShowing = openForm ? true : this.state.showForm;
        this.setState({
            showForm: !isShowing,
            events: {
                ...this.state.events,
                [eventId]: {
                    eventData: event
                }
            }
        });
    }

    handleSelectEditEvent = (event, eventId) => {
        this.setState({
            selectedEvent: {
                eventId,
                event
            },
            showForm: true
        });
    }

    handleAttendanceChange = (eventId, memberId, attendance) => {
        const event = this.state.events[eventId];
        this.setState({
            events: {
                ...this.state.events,
                [eventId]: {
                    eventData: event.eventData,
                    attendance: {
                        ...event.attendance,
                        [memberId]: attendance
                    }
                }
            }
        });
    }

    render() {
        const { classes, user } = this.props;
        const { events, showForm, selectedEvent } = this.state;

        return (
            <div>
                { !showForm
                    ? <Tooltip title="Lägg till evenemang">
                        <Button variant="fab" color="secondary" onClick={() => this.handleToggleEventForm(true)} className={classes.buttonRight}>
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    : undefined }
                <h2>Intern kalender</h2>
                <p>Kommande evenemang. Kommer även att innehålla närvaro-koll.</p>
                { showForm
                    ? <CalendarEventForm closeFormEvent={(id, e) => this.handleToggleEventForm(false, id, e)} event={selectedEvent.event} eventId={selectedEvent.eventId} />
                    : undefined }
                
                {Object.keys(events).map((eventId, i) => {
                    return (
                        <Fragment key={i}>
                            <Grid container spacing={24}>
                                <AttendanceCheck
                                    user={user}
                                    eventId={eventId}
                                    eventAttendance={events[eventId].attendance}
                                    onAttendanceChange={this.handleAttendanceChange}
                                />
                                <CalendarItem isInternalCalendar={true} event={events[eventId].eventData} eventId={eventId} key={i} handleSelectEditEvent={(e, id) => this.handleSelectEditEvent(e, id)} />
                            </Grid>
                        </Fragment>
                    );
                })}
            </div>
        );
    }
})