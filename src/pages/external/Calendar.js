import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Calendar extends Component {
  render() {
    return (
      <div>
        <h2>Kalender</h2>
        <p>Här kan du höra oss</p>
      </div>
    );
  }
}

Calendar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default Calendar;
