import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Grid,
    List,
    ListItem,
    ListItemText,
    Badge,
    Tooltip,
    IconButton,
    ListItemAvatar,
    Avatar,
    Button
} from '@material-ui/core';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    ThumbsUpDown as ThumbsUpDownIcon,
    Remove as RemoveIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Person as PersonIcon
} from '@material-ui/icons';
import Constants from '../common/Constants';
import FirebaseApp from '../FirebaseApp';
import { green, yellow } from '@material-ui/core/colors';

const styles = theme => ({
    title: {
        cursor: 'pointer',
    },
    listText: {
        fontSize: 11
    },
    unattendedListText: {
        fontStyle: 'italic'
    },
    countBadge: {
        paddingRight: theme.spacing.unit * 2,
        fontWeight: 'bold'
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
    unattendedButton: {
        float: 'right',
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit * 3
    }
});

class AttendanceList extends Component {
    state = {
        members: [],
        expanded: false,
        showUnattended: false
    }
    componentWillMount() {
        FirebaseApp.voxette.fetchMembers('', '', '', (members) => {
            if (members) {
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
    toggleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }
    toggleUnattended = () => {
        this.setState({
            showUnattended: !this.state.showUnattended
        });
    }
    render() {
        const {
            classes,
            eventAttendance
        } = this.props;
        const {
            members,
            expanded,
            showUnattended
        } = this.state;
        if (!eventAttendance) {
            return null;
        }
        const attendanceMemberIds = Object.keys(eventAttendance);

        const attendance = attendanceMemberIds.map(x => ({
            ...eventAttendance[x],
            memberId: x
        }));

        const unattended = showUnattended
            ? members.filter(x => !attendanceMemberIds.some(memberId => memberId == x.userData.memberId))
            : [];
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <h4 className={classes.title} onClick={this.toggleExpand}>
                            Närvaro
                            <Tooltip title={expanded ? 'Visa mindre' : 'Visa mer'}>
                                <IconButton className={classes.expandButton} aria-label="Expandera" color="secondary" onClick={this.handleExpandClick}>
                                    { expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                                </IconButton>
                            </Tooltip>
                        </h4>
                    </Grid>
                    <Grid item xs={6}>
                        {
                            expanded
                                ? <Button onClick={this.toggleUnattended} className={classes.unattendedButton}>{showUnattended ? 'Dölj' : 'Visa'} oanmälda</Button>
                                : undefined
                        }
                    </Grid>
                </Grid>
                {
                    expanded
                    ? <Grid container spacing={8}>
                        {
                            // Separate grid item by each part
                            Constants.partValues.map(part => {
                                const partAttendance = attendance
                                    .filter(x => x.part === part)
                                    .sort(this.orderAttendance);

                                return (
                                    <Grid item xs={12} sm={6} md={3} key={part}>
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
                                                            <ListItemAvatar>
                                                                {
                                                                    userData.pictureUrl
                                                                        ? <Avatar src={userData.pictureUrl} alt={userData.firstName} />
                                                                        : <Avatar>
                                                                            <PersonIcon />
                                                                        </Avatar>
                                                                }
                                                            </ListItemAvatar>
                                                            <ListItemText className={classes.listText} primary={`${userData.firstName} ${userData.lastName}`} />
                                                            {choice}
                                                        </ListItem>
                                                        : undefined
                                                    );
                                                })
                                            }
                                        </List>
                                        {
                                            showUnattended
                                                ? <List dense>
                                                    {
                                                        unattended
                                                            .filter(x => x.userData.part == part)
                                                            .map(member => (
                                                                <ListItem key={member.userData.memberId}>
                                                                    <ListItemAvatar>
                                                                        {
                                                                            member.userData.pictureUrl
                                                                                ? <Avatar src={member.userData.pictureUrl} alt={member.userData.firstName}/>
                                                                                : <Avatar><PersonIcon /></Avatar>
                                                                        }
                                                                    </ListItemAvatar>
                                                                    <ListItemText className={`${classes.unattendedListText} ${classes.listText}`} primary={`${member.userData.firstName} ${member.userData.lastName}`} />
                                                                    <RemoveIcon />
                                                                </ListItem>
                                                            ))
                                                    }
                                                </List>
                                                : undefined
                                        }
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                    : undefined
                }
            </Grid>
        );
    }
}

AttendanceList.propTypes = {
    classes: PropTypes.object.isRequired,
    eventAttendance: PropTypes.object
};

export default withStyles(styles)(AttendanceList);