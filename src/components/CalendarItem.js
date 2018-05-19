import React, { Component } from 'react';

export default class CalendarItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.calendarEvent === undefined) return null;
        var event = this.props.calendarEvent;
        var eventDate = event.StartDate + ' kl: ' + event.StartTime + ' - ';
        if (event.StartDate == event.EndDate){
            eventDate += event.EndTime;
        } else {
            eventDate += event.EndDate + ' kl: ' + event.EndTime;
        }
        return (
            <div className="calendar-item">
                <h3>{event.Title}</h3>
                När: {eventDate}
            </div>
        );
    }
}