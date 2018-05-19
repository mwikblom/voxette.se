import React, { Component } from 'react';
import CalendarEvent from '../../models/CalendarEvent';
import CalendarItem from '../../components/CalendarItem';

export default class InternalCalendar extends Component {
    constructor(props) {
        super(props);
        this.calendarEvents = this.calendarEvents.bind(this);
    }
    render() {
        return (
            <div>
                <h2>Kalender</h2>
                <p>Interna kalendern med närvaro.</p>
                {this.calendarEvents().map((element) => {
                    return (<CalendarItem calendarEvent={element} />);
                })}
            </div>
        );
    }
    calendarEvents() { // TODO: change mocked events
        return [
            new CalendarEvent(
                'Kördag/Genrep inför Voxette 20 år',
                '2018-06-01',
                '10:00',
                '2018-06-01',
                '15:00'
            ), 
            new CalendarEvent(
                'Konsert - Voxette 20 år',
                '2018-06-02',
                '15:00',
                '2018-06-02',
                '17:00'
            )
        ];
    }
}