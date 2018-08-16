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

    handleToggleEventForm = (close = null) => {
        var isShowing = this.state.showForm;
        if (close){
            isShowing = true;
        }
        this.setState({
            showForm: !isShowing
        });
    }

    handleSelectEditEvent = (event) => {
        this.setState({
            selectedEvent: event,
            showForm: true
        });
    }

    render() {
        const { classes } = this.props;
        const { events, showForm, selectedEvent } = this.state;

        return (
            <div>
                { !showForm
                    ? <Button variant="fab" color="primary" onClick={() => this.handleToggleEventForm()} className={classes.buttonRight}>
                        <AddIcon />
                    </Button>
                    : undefined }
                <h2>Intern kalender</h2>
                <p>Kommande evenemang. Kommer även att innehålla närvaro-koll.</p>
                { showForm
                    ? <CalendarEventForm closeFormEvent={() => this.handleToggleEventForm(false)} event={selectedEvent} />
                    : undefined }
                
                {Object.values(events).map((event, i) => {
                    return (<CalendarItem event={event.eventData} key={i} handleSelectEditEvent={(e) => this.handleSelectEditEvent(e)} />);
                })}
            </div>
        );
    }
})