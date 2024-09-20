import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import DateTimeHelper from '../../common/DateTimeHelper';

const styles = {
  paper: {
    padding: 10,
  },
  textField: {
    width: '100%',
    marginTop: '10px',
  },
  action: {
    margin: '10px 10px 10px 0',
  },
  buttonIcon: {
    marginRight: '5px',
  },
  removeButton: {
    float: 'right',
  },
  publicDescription: {
    width: '100%',
  },
};

export default withStyles(styles)(
  class CalendarEventForm extends Component {
    state = this.getInitalState();

    getInitalState() {
      const { event, eventId } = this.props;
      const today = DateTimeHelper.getFormattedDate(new Date());

      return event
        ? {
            eventId,
            event,
            editMode: true,
            hasChanges: false,
          }
        : {
            eventId: '',
            event: {
              title: '',
              description: '',
              publicDescription: '',
              location: '',

              meetupTime: '',
              startDate: today,
              endDate: today,
              startTime: DateTimeHelper.getTimeNextFullHour(),
              endTime: DateTimeHelper.getTimeNextFullHour(1),
              isPublic: false,
              hasAttendanceCheck: true,
            },
            editMode: false,
            hasChanges: false,
          };
    }

    handleChange = (name) => (e) => {
      var event = this.state.event;
      event[name] = e.target.value;

      if (event.endDate < event.startDate) {
        event.endDate = event.startDate;
      }

      if (event.meetupTime > event.startTime) {
        event.meetupTime = event.startTime;
      }

      this.setState({
        event,
        hasChanges: true,
      });
    };

    handleCheckedChange = (name) => (e) => {
      var event = this.state.event;
      event[name] = e.target.checked;

      this.setState({
        event,
        hasChanges: true,
      });
    };

    saveEvent = (e) => {
      e.preventDefault();

      const { eventId, event, editMode } = this.state;

      if (editMode) {
        event.updated = DateTimeHelper.getCurrentTimestamp();
        FirebaseApp.voxette.updateEventData(eventId, event, () => {
          this.setState({
            hasChanges: false,
          });
          this.props.closeFormEvent(eventId, event);
        });
      } else {
        event.created = DateTimeHelper.getCurrentTimestamp();
        FirebaseApp.voxette.addEventData(event, (eventId) => {
          event.eventId = eventId;
          FirebaseApp.voxette.updateEventData(eventId, event, () => {
            this.setState({
              hasChanges: false,
              eventId,
            });
            this.props.closeFormEvent(eventId, event);
          });
        });
      }
    };

    removeEvent = () => {
      const { eventId } = this.state;
      FirebaseApp.voxette.removeEvent(eventId, () => {
        this.props.closeFormEvent(eventId, null);
      });
    };

    handleEventSaved = (key) => {
      this.setState({
        hasChanges: false,
      });
    };

    render() {
      const { classes, closeFormEvent } = this.props;
      const { editMode, hasChanges, event } = this.state;

      const heading = editMode ? 'Redigera evenemang' : 'Lägg till evenemang';

      return (
        <div>
          <Paper className={classes.paper}>
            {editMode ? (
              <Button
                className={classes.removeButton}
                color="primary"
                onClick={this.removeEvent}
              >
                <DeleteIcon className={classes.buttonIcon} />
                Ta bort
              </Button>
            ) : undefined}
            <h2>Kalender - {heading}</h2>
            <form
              className={classes.root}
              autoComplete="off"
              onSubmit={(e) => this.saveEvent(e)}
            >
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <TextField
                    id="title"
                    label="Titel"
                    className={classes.textField}
                    value={event.title}
                    onChange={this.handleChange('title')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    label="Beskrivning"
                    multiline={true}
                    className={classes.textField}
                    value={event.description}
                    onChange={this.handleChange('description')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="location"
                    label="Plats"
                    multiline={true}
                    className={classes.textField}
                    value={event.location}
                    onChange={this.handleChange('location')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="startDate"
                    label="Startdatum"
                    type="date"
                    className={classes.textField}
                    value={event.startDate}
                    onChange={this.handleChange('startDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="startTime"
                    label="Starttid"
                    type="time"
                    className={classes.textField}
                    value={event.startTime}
                    onChange={this.handleChange('startTime')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="endDate"
                    label="Slutdatum"
                    type="date"
                    className={classes.textField}
                    value={event.endDate}
                    onChange={this.handleChange('endDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="endTime"
                    label="Sluttid"
                    type="time"
                    className={classes.textField}
                    value={event.endTime}
                    onChange={this.handleChange('endTime')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="meetupTime"
                    label="Samlingstid"
                    type="time"
                    className={classes.textField}
                    value={event.meetupTime}
                    onChange={this.handleChange('meetupTime')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={event.hasAttendanceCheck}
                        onChange={this.handleCheckedChange(
                          'hasAttendanceCheck'
                        )}
                        value="hasAttendanceCheck"
                      />
                    }
                    label="Närvarokoll"
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={event.isPublic}
                        onChange={this.handleCheckedChange('isPublic')}
                        value="isPublic"
                      />
                    }
                    label="Publikt evenemang"
                  />
                </Grid>
                {event.isPublic &&
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      id="publicDescription"
                      label="Publik beskrivning (visas externt på hemsidan)"
                      multiline={true}
                      className={classes.publicDescription}
                      value={event.publicDescription}
                      onChange={this.handleChange('publicDescription')}
                    />
                  </Grid>
                }
              </Grid>

              <Button
                className={classes.action}
                variant="outlined"
                onClick={closeFormEvent}
              >
                <CancelIcon className={classes.buttonIcon} />
                Stäng
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!hasChanges}
                className={classes.action}
                type="submit"
              >
                <SaveIcon className={classes.buttonIcon} />
                Spara ändringar
              </Button>
            </form>
          </Paper>
        </div>
      );
    }
  }
);
