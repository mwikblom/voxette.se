import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from 'react-router-dom';

const styles = {
    root: {
    },
    textField: {
        width: '100%',
        marginTop: '10px'
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

        if (event.endDate < event.startDate){
            event.endDate = event.startDate;
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

        const { eventId, editMode } = this.state;

        if (editMode){
            FirebaseApp.voxette.updateEventData(eventId, this.state.event, () => {
                this.setState({
                    hasChanges: false
                });
            });
        } else {
            FirebaseApp.voxette.addEventData(this.state.event, (eventId) => {
                this.setState({
                    hasChanges: false,
                    eventId
                });
            });
        }
    }

    handleEventSaved = (key) => {
        this.setState({
            hasChanges: false
        });
    }

    render() {
        const { classes } = this.props;
        const { 
            editMode,
            hasChanges,
            event: {
                title,
                description,
                startDate,
                startTime,
                endDate,
                endTime,
                isPublic
            }
        } = this.state;

        const heading = editMode
            ? 'Redigera evenemang'
            : 'Lägg till evenemang';

        return (
            <div>
                <h2>Kalender - {heading}</h2>
                <form className={classes.root} autoComplete="off" onSubmit={(e) => this.saveEvent(e)}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <TextField
                                id="title"
                                label="Titel"
                                className={classes.textField}
                                value={title}
                                onChange={this.handleChange('title')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="description"
                                label="Beskrivning"
                                multiline={true}
                                className={classes.textField}
                                value={description}
                                onChange={this.handleChange('description')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="startDate"
                                label="Startdatum"
                                type="date"
                                className={classes.textField}
                                value={startDate}
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
                                value={startTime}
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
                                value={endDate}
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
                                value={endTime}
                                onChange={this.handleChange('endTime')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isPublic}
                                        onChange={this.handleCheckedChange('isPublic')}
                                        value="isPublic"
                                    />
                                }
                                label="Publikt evenemang"
                            />
                        </Grid>
                    </Grid>
                    
                    <Button component={Link} className={classes.action} variant="contained" to="/inloggad/kalender">
                        <CancelIcon />
                        Stäng
                    </Button>
                    <Button variant="contained" color="primary" disabled={!hasChanges} className={classes.action} type="submit">
                        <SaveIcon />
                        Spara ändringar
                    </Button>
                </form>
            </div>
        );
    }
})