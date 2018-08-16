import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import CalendarEventForm from './CalendarEventForm';
import CalendarItem from '../../components/CalendarItem';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = {
    buttonRight: {
        float: 'right',
        marginRight: '5px'    
    }
};

export default withStyles(styles)(class InternalCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: {},
            showForm: false
        };
    }

    componentWillMount() {
        FirebaseApp.voxette.fetchAllEvents((events) => {
            if (events) {
                this.setState({
                    events
                });
            }
        });
    }

    toggleEventForm = (close = null) => {
        var isShowing = this.state.showForm;
        if (close){
            isShowing = true;
        }
        this.setState({
            showForm: !isShowing
        });
    }

    render() {
        const { classes } = this.props;
        const { events } = this.state;

        return (
            <div>
                <Button variant="fab" color="primary" onClick={this.toggleEventForm} className={classes.buttonRight}>
                    <AddIcon />
                </Button>
                <h2>Intern kalender</h2>
                <p>Interna kalendern med närvaro.</p>
                {
                    this.state.showForm
                        ? <CalendarEventForm closeFormEvent={() => this.toggleEventForm(false)} />
                        : undefined
                }
                
                {Object.values(events).map((event, i) => {
                    return (<CalendarItem calendarEvent={event.eventData} key={i} />);
                })}
            </div>
        );
    }
})