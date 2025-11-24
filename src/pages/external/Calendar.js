import React, { Component } from 'react';
import CalendarItem from '../../components/CalendarItem';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Divider,
  CircularProgress,
} from '@material-ui/core';

const styles = (theme) => ({
  progress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export default withStyles(styles)(
  class Calendar extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        events: [],
      };
    }
    
    componentDidMount() {
      this.fetchEvents();
    }
    
    fetchEvents = () => {
      FirebaseApp.voxette.fetchUpcomingEvents(
        false,
        new Date(),
        undefined,
        (events) => {
          if (events) {
            this.setState({
              loading: false,
              events,
            });
          }
        }
      );
    };

    render() {
      const { classes } = this.props;
      const { loading, events } = this.state;

      return (
        <div>
          <h1>Kalender</h1>
          <p>Här kan du höra oss</p>
          {loading ? (
              <CircularProgress size={40} className={classes.progress} />
            ) : (
              events.map((event, i) => {
                const eventId = event.eventData.eventId;
                return (
                  <div key={i}>
                    <Grid container>
                      <CalendarItem
                        isInternalCalendar={false}
                        event={event.eventData}
                        eventId={eventId}
                        key={i}
                      />
                    </Grid>
                    <Divider variant="fullWidth" />
                  </div>
                );
              })
            )}
        </div>
      );
    }
  }
);
