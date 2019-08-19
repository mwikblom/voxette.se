import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import CalendarEventForm from './CalendarEventForm';
import CalendarItem from '../../components/CalendarItem';
import {
    Button,
    Tooltip,
    Grid,
    Divider
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AttendanceCheck from '../../components/AttendanceCheck';
import AttendanceList from '../../components/AttendanceList';

const styles = theme => ({
    buttonRight: {
        float: 'right',
        marginRight: '10px'    
    }
});

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
        const isShowing = openForm ? false : this.state.showForm;
        let events = {
            ...this.state.events
        };
        if (eventId && event) {
            // Event has been updated
            const attendance = events[eventId] ? events[eventId].attendance : undefined;
            events = {
                ...events,
                [eventId]: {
                    eventData: event,
                    attendance
                }
            };
        } else if (eventId) {
            // Event has been removed
            delete events[eventId];
        }
        this.setState({
            events,
            showForm: !isShowing
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

    handleAddEventClick = () => {
        this.setState({
            selectedEvent: null
        }, this.handleToggleEventForm(true));
    }

    render() {
        const { classes, user } = this.props;
        const { events, showForm, selectedEvent } = this.state;

        return (
            <div>
                { !showForm
                    ? <Tooltip title="Lägg till evenemang">
                        <Button variant="fab" color="secondary" onClick={this.handleAddEventClick} className={classes.buttonRight}>
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    : undefined }
                <h2>Intern kalender</h2>
                <p>Kommande evenemang med närvaro-koll.</p>
                {
                    showForm
                        ? <CalendarEventForm closeFormEvent={(id, e) => this.handleToggleEventForm(false, id, e)} event={selectedEvent ? selectedEvent.event : undefined} eventId={selectedEvent ? selectedEvent.eventId : undefined} />
                        : undefined
                }

                <Divider variant="middle" />
                {Object.keys(events).map((eventId, i) => {
                    return (
                        <div key={i}>
                            <Grid container spacing={24} className={classes.eventGrid}>
                                <CalendarItem isInternalCalendar={true} event={events[eventId].eventData} eventId={eventId} key={i} handleSelectEditEvent={(e, id) => this.handleSelectEditEvent(e, id)} />
                                <AttendanceCheck
                                    user={user}
                                    eventId={eventId}
                                    eventAttendance={events[eventId].attendance}
                                    onAttendanceChange={this.handleAttendanceChange}
                                />
                                <AttendanceList eventAttendance={events[eventId].attendance} />
                            </Grid>
                            <Divider variant="middle" />
                        </div>
                    );
                })}
            </div>
        );
    }
})