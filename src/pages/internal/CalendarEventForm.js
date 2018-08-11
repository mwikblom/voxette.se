import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, FormControlLabel, Checkbox } from '@material-ui/core';

const styles = {
    root: {
    },
    textField: {
        width: '100%',
        marginTop: '10px'
    }
};

export default withStyles(styles)(class CalendarEventForm extends Component {
    state = this.getInitalState();

    getInitalState() {
        var { event } = this.props;
        
        return event 
            ? {
                event,
                editMode: true
            }
            : {
                event: {
                    title: '',
                    description: '',
                    startDate: '',
                    startTime: '',
                    endDate: '',
                    endTime: '',
                    isPublic: false
                },
                editMode: false
            };
    }
    
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    
    handleCheckedChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        const { classes } = this.props;
        const { 
            editMode,
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
                <form className={classes.root} autoComplete="off">
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
                                className={classes.textField}
                                value={description}
                                onChange={this.handleChange('description')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="startDate"
                                label="Startdatum"
                                className={classes.textField}
                                value={startDate}
                                onChange={this.handleChange('startDate')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="startTime"
                                label="Starttid"
                                className={classes.textField}
                                value={startTime}
                                onChange={this.handleChange('startTime')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="endDate"
                                label="Slutdatum"
                                className={classes.textField}
                                value={endDate}
                                onChange={this.handleChange('endDate')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="endTime"
                                label="Sluttid"
                                className={classes.textField}
                                value={endTime}
                                onChange={this.handleChange('endTime')}
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
                </form>
            </div>
        );
    }
})