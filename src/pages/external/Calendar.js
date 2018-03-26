import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableContent from '../../components/EditableContent';

class Calendar extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div>
                {this.props.loggedIn ? <EditableContent dataKey="contact"/> : null }
                <h2>Kalender</h2>
                <p>Här kan du höra oss</p>
            </div>
        );
    }
}


Calendar.propTypes = {
    loggedIn: PropTypes.bool.isRequired
};

export default Calendar;