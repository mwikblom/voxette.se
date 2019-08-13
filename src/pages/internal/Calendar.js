import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import CalendarEventForm from './CalendarEventForm';
import CalendarItem from '../../components/CalendarItem';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

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

    render() {
        const { classes } = this.props;
        const { events, showForm, selectedEvent } = this.state;

        return (
            <div>
                { !showForm
                    ? <Button variant="fab" color="primary" onClick={() => this.handleToggleEventForm(true)} className={classes.buttonRight}>
                        <AddIcon />
                    </Button>
                    : undefined }
                <h2>Intern kalender</h2>
                <p>Kommande evenemang. Kommer även att innehålla närvaro-koll.</p>
                { showForm
                    ? <CalendarEventForm closeFormEvent={(id, e) => this.handleToggleEventForm(false, id, e)} event={selectedEvent.event} eventId={selectedEvent.eventId} />
                    : undefined }
                
                {Object.keys(events).map((eventId, i) => {
                    return (<CalendarItem event={events[eventId].eventData} eventId={eventId} key={i} handleSelectEditEvent={(e, id) => this.handleSelectEditEvent(e, id)} />);
                })}
            </div>
        );
    }
})