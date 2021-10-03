import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Grid } from '@material-ui/core';
import {
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@material-ui/icons/';
import { withStyles, Typography, Tooltip } from '@material-ui/core';

const styles = (theme) => ({
  title: {
    marginBottom: 0,
    color: theme.palette.primary.main,
  },
  meetupTime: {
    paddingLeft: theme.spacing.unit,
  },
  expandButton: {
    display: 'block',
  },
  editIcon: {
    float: 'right',
  },
});

class CalendarItem extends Component {
  state = {
    expanded: false,
  };
  handleSelectEdit = () => {
    var { handleSelectEditEvent, event, eventId } = this.props;
    handleSelectEditEvent({ ...event }, eventId);
  };
  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };
  render() {
    if (this.props.event === undefined) return null;

    const {
      classes,
      event: {
        startDate,
        startTime,
        endDate,
        endTime,
        meetupTime,
        title,
        description,
        location,
      },
      isInternalCalendar,
    } = this.props;
    const { expanded } = this.state;

    var eventDate = startDate + ' kl: ' + startTime + ' - ';
    if (startDate === endDate) {
      eventDate += endTime;
    } else {
      eventDate += endDate + ' kl: ' + endTime;
    }

    const previewLength = 110;
    const shouldExpand = description.length > previewLength;
    const previewDescription = shouldExpand
      ? description.substring(0, previewLength) + '...'
      : description;
    return (
      <Grid item xs={true}>
        <h3 className={classes.title}>
          {isInternalCalendar && (
            <Tooltip title="Redigera">
              <IconButton
                aria-label="Redigera"
                className={classes.editIcon}
                color="primary"
                onClick={this.handleSelectEdit}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {title}
          <Typography variant="caption" component="p">
            {eventDate}
            {isInternalCalendar && meetupTime ? (
              <span className={classes.meetupTime}>
                (Samling kl: {meetupTime})
              </span>
            ) : undefined}
          </Typography>
        </h3>
        <Typography variant="caption" component="p">
          Plats: {location}
        </Typography>
        <p className={classes.description}>
          {expanded ? description : previewDescription}
          {shouldExpand && (
            <Tooltip title={expanded ? 'Visa mindre' : 'Visa mer'}>
              <IconButton
                className={classes.expandButton}
                aria-label="Expandera"
                color="secondary"
                onClick={this.handleExpandClick}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          )}
        </p>
      </Grid>
    );
  }
}

CalendarItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CalendarItem);
