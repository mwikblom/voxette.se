import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

export default class CalendarItem extends Component {
    handleSelectEdit = () => {
        var { handleSelectEditEvent, event, eventId } = this.props;
        handleSelectEditEvent({ ...event }, eventId);
    }
    render() {
        if (this.props.event === undefined) return null;
        
        const {
            event: {
                startDate,
                startTime,
                endDate,
                endTime,
                title,
                description
            }
        } = this.props;
        
        var eventDate = startDate + ' kl: ' + startTime + ' - ';
        if (startDate === endDate){
            eventDate += endTime;
        } else {
            eventDate += endDate + ' kl: ' + endTime;
        }
        return (
            <div className="calendar-item">
                <h3>
                    {title}
                    <IconButton aria-label="redigera" color="primary" onClick={this.handleSelectEdit}>
                        <EditIcon />
                    </IconButton>
                </h3>
                <p>{description}</p>
                <p>
                    När: {eventDate}
                </p>
            </div>
        );
    }
}