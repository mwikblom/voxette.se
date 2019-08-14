import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = {
    paper: {
        padding: 10
    },
    textField: {
        width: '100%',
        marginTop: '10px'
    },
    action: {
        margin: '10px 10px 10px 0'
    },
    buttonIcon: {
        marginRight: '5px'   
    }
};

const getDefaultDate = () => {
    // Today
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;

    var year = today.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year + '-' + month + '-' + day;
}

const getDefaultTime = (plusHours = 0) => {
    // Next full hour
    var today = new Date();
    var hour = today.getHours() + 1;
    hour += plusHours;
    if (hour > 23) {
        hour = 0;
    }

    if (hour < 10) {
        hour = '0' + hour;
    }
    return hour + ':00';
}
const getCurrentTimestamp = () => {
    var today = new Date();

    var day = today.getDate();
    var month = today.getMonth() + 1; // starts at 0
    var year = today.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    
    var hour = today.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }

    var minutes = today.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
}

export default withStyles(styles)(class CalendarEventForm extends Component {
    state = this.getInitalState();
    
    getInitalState() {
        const { event, eventId } = this.props;

        return event 
            ? {
                eventId,
                event,
                editMode: true, 
                hasChanges: false
            }
            : {
                eventId: '',
                event: {
                    title: '',
                    description: '',
                    location: '',

                    meetupTime: getDefaultTime(),
                    startDate: getDefaultDate(),
                    endDate: getDefaultDate(),
                    startTime: getDefaultTime(),
                    endTime: getDefaultTime(1),
                    isPublic: false
                },
                editMode: false,
                hasChanges: false
            };
    }
    
    handleChange = name => e => {
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
            hasChanges: true
        });
    };
    
    handleCheckedChange = name => e => {
        var event = this.state.event;
        event[name] = e.target.checked;

        this.setState({
            event,
            hasChanges: true
        });
    };

    saveEvent = (e) => {
        e.preventDefault();

        const { eventId, event, editMode } = this.state;

        if (editMode) {
            event.updated = getCurrentTimestamp();
            FirebaseApp.voxette.updateEventData(eventId, event, () => {
                this.setState({
                    hasChanges: false
                });
                this.props.closeFormEvent(eventId, event);
            });
        } else {
            event.created = getCurrentTimestamp();
            FirebaseApp.voxette.addEventData(event, (eventId) => {
                this.setState({
                    hasChanges: false,
                    eventId
                });
                this.props.closeFormEvent(eventId, event);
            });
        }
    }

    handleEventSaved = (key) => {
        this.setState({
            hasChanges: false
        });
    }

    render() {
        const { classes, closeFormEvent } = this.props;
        const { 
            editMode,
            hasChanges,
            event
        } = this.state;

        const heading = editMode
            ? 'Redigera evenemang'
            : 'Lägg till evenemang';

        return (
            <div>
                <Paper className={classes.paper}>
                    <h2>Kalender - {heading}</h2>
                    <form className={classes.root} autoComplete="off" onSubmit={(e) => this.saveEvent(e)}>
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
                                            checked={event.isPublic}
                                            onChange={this.handleCheckedChange('isPublic')}
                                            value="isPublic"
                                        />
                                    }
                                    label="Publikt evenemang"
                                />
                            </Grid>
                        </Grid>
                        
                        <Button className={classes.action} variant="outlined" onClick={closeFormEvent}>
                            <CancelIcon className={classes.buttonIcon} />
                            Stäng
                        </Button>
                        <Button variant="outlined" color="primary" disabled={!hasChanges} className={classes.action} type="submit">
                            <SaveIcon className={classes.buttonIcon} />
                            Spara ändringar
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }
})