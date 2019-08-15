import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Grid,
    List,
    ListItem,
    ListItemText,
    Badge
} from '@material-ui/core';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    ThumbsUpDown as ThumbsUpDownIcon,
} from '@material-ui/icons';
import Constants from '../common/Constants';
import FirebaseApp from '../FirebaseApp';
import { green, yellow } from '@material-ui/core/colors';

const styles = theme => ({
    listText: {
        fontSize: 11
    },
    countBadge: {
        paddingRight: theme.spacing.unit * 2
    },
    yes: {
        color: green[400],
    },
    no: {
        color: theme.palette.primary.main,
    },
    maybe: {
        color: yellow[600],
    },
});

class AttendanceList extends Component {
    state = {
        members: []
    }
    componentWillMount() {
        FirebaseApp.voxette.fetchMembers('', '', '', (members) => {
            if (members) {
                console.log('members', members);
                // Store active members
                this.setState({
                    members: Object.values(members).filter(x => x.userData.tags === undefined || !x.userData.tags.includes(Constants.inactive))
                });
            }
        });
    }
    orderAttendance(a, b) {
        if (a.choice == b.choice) {
            return 0;
        }
        if (a.choice == 1 || b.choice != 1) {
            return 1;
        }
        return -1;
    }
    render() {
        const {
            classes,
            eventAttendance
        } = this.props;
        const { members } = this.state;
        const attendanceMemberIds = Object.keys(eventAttendance);

        const attendance = attendanceMemberIds.map(x => ({
            ...eventAttendance[x],
            memberId: x
        }));
        
        return (
            <Grid item xs={12}>
                <Grid container spacing={8}>
                    {
                        // Separate grid item by each part
                        Constants.partValues.map(part => {
                            const partAttendance = attendance
                                .filter(x => x.part === part)
                                .sort(this.orderAttendance);

                            return (
                                <Grid item xs={6} sm={3} key={part}>
                                    <Badge
                                        className={classes.countBadge}
                                        badgeContent={partAttendance.filter(x => x.choice == 1).length}
                                        color="secondary"
                                    >
                                        {part}
                                   </Badge>
                                    <List dense>
                                        {
                                            // Separate list items by each member attendance
                                            partAttendance.map(attend => {
                                                const member = members.find(x => x.userData.memberId == attend.memberId);
                                                console.log('attend', typeof members, member, members);
                                                const userData = member && member.userData ? member.userData : undefined;
                                                const choice = attend.choice == 1
                                                    ? <ThumbUpIcon className={classes.yes} />
                                                    : attend.choice == 0
                                                    ? <ThumbDownIcon className={classes.no}/>
                                                    : attend.choice == 2
                                                    ? <ThumbsUpDownIcon className={classes.maybe}/>
                                                    : '';
                                                return (userData
                                                    ? <ListItem key={attend.memberId}>
                                                        {choice}
                                                        <ListItemText className={classes.listText} primary={`${userData.firstName} ${userData.lastName}`} />
                                                    </ListItem>
                                                    : undefined
                                                );
                                            })
                                        }
                                    </List>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </Grid>
        );
    }
}

AttendanceList.propTypes = {
    classes: PropTypes.object.isRequired,
    eventAttendance: PropTypes.object
};

export default withStyles(styles)(AttendanceList);