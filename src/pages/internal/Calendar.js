import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import CalendarEventForm from './CalendarEventForm';
import CalendarItem from '../../components/CalendarItem';

export default class InternalCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: {},
            selectedEventId: null
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

    render() {
        const { events } = this.state;

        return (
            <div>
                <h2>Intern kalender</h2>
                <p>Interna kalendern med närvaro.</p>
                <CalendarEventForm />
                {Object.values(events).map((event) => {
                    return (<CalendarItem calendarEvent={event.eventData} />);
                })}
            </div>
        );
    }
}