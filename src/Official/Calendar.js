import React, { Component } from 'react';
import EditableContent from '../components/EditableContent';

class Calendar extends Component {
    render() {
        return (
            <div>
                <EditableContent dataKey="contact"/>
                <h2>Kalender</h2>
                <p>Här kan du höra oss</p>
            </div>
        );
    }
}

export default Calendar;