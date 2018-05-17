import React, { Component } from 'react';

export default class CalendarItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var event = this.props.calendarEvent;
        var eventDate = event.startDate + ' kl: ' + event.startTime + ' - ';
        if (event.startDate == event.endDate){
            eventDate += event.endTime;
        } else {
            eventDate += event.endDate + ' kl: ' + event.endTime;
        }
        return 
            <div className="calendar-item">
                <h3>{event.title}</h3>
                {eventDate}
            </div>
        ;
    }
}