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
                {this.calendarEvents().forEach(element => {
                   <CalendarItem calendarEvent={element} />
                })}
            </div>
        );
    }
    calendarEvents() {
        return [
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