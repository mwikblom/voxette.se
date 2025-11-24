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
  Icon,
  ListItemAvatar,
  Avatar,
  Button,
} from '@material-ui/core';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
} from '@material-ui/icons';
import Constants from '../common/Constants';
import { green, grey, red } from '@material-ui/core/colors';

const styles = (theme) => ({
  titleButton: {
    marginBottom: theme.spacing(2),
  },
  title: {
    textTransform: 'none',
    display: 'flex',
    gap: theme.spacing(),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  listText: {
    fontSize: 11,
  },
  listItem: {
    borderLeft: `1px solid ${grey[300]}`,
  },
  unattendedListText: {
    fontStyle: 'italic',
  },
  firstBadge: {
    display: 'block',
    fontWeight: 'bold',
  },
  otherBadge: {
    paddingRight: theme.spacing(3),
    display: 'block',
    fontWeight: 'bold',
  },
  yes: {
    color: green[400],
  },
  no: {
    color: red[600],
  },
  unattendedButton: {
    float: 'right',
    marginBottom: theme.spacing(),
    marginTop: theme.spacing(3),
  },
});

const NoBadge = withStyles((theme) => ({
  badge: {
    background: red[600],
    color: '#fff',
    top: -2,
    right: 0,
  },
}))((props) => <Badge {...props}>{props.children}</Badge>);

const YesBadge = withStyles({
  badge: {
    background: green[400],
    color: '#fff',
    top: -2,
    right: 0,
  },
})((props) => <Badge {...props}>{props.children}</Badge>);

class AttendanceList extends Component {
  state = {
    expanded: false,
    showUnattended: false,
  };
  orderAttendance(a, b) {
    if (a.choice == b.choice) {
      return 0;
    }
    if (a.choice == 1 || (b.choice != 1 && a.choice == 2)) {
      return -1;
    }
    return 1;
  }
  toggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };
  toggleUnattended = () => {
    this.setState({
      showUnattended: !this.state.showUnattended,
    });
  };
  render() {
    const { classes, members, eventAttendance } = this.props;
    const { expanded, showUnattended } = this.state;
    if (!eventAttendance) {
      return null;
    }
    const attendanceMemberIds = Object.keys(eventAttendance);

    const attendance = attendanceMemberIds.map((x) => ({
      ...eventAttendance[x],
      memberId: x,
    }));

    const unattended = showUnattended
      ? members.filter(
          (x) =>
            !attendanceMemberIds.some(
              (memberId) => memberId == x.userData.memberId
            )
        )
      : [];
    return (
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <Tooltip title={expanded ? 'Visa mindre' : 'Visa mer'}>
              <Button variant="text" className={classes.titleButton} onClick={this.toggleExpand}>
                <h3 className={classes.title}>
                  Närvaro
                  <Icon
                    className={classes.expandIcon}
                    aria-label="Expandera"
                    color="secondary"
                  >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Icon>
                </h3>
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            {expanded ? (
              <Button
                onClick={this.toggleUnattended}
                className={classes.unattendedButton}
              >
                {showUnattended ? 'Dölj' : 'Visa'} oanmälda
              </Button>
            ) : undefined}
          </Grid>
        </Grid>
        {expanded ? (
          <Grid container spacing={4}>
            {
              // Separate grid item by each part
              Constants.partValues.map((part) => {
                const partAttendance = attendance
                  .filter((x) => x.part === part)
                  .sort(this.orderAttendance);
                const yes = partAttendance.filter((x) => x.choice == 1).length;
                const no = partAttendance.filter((x) => x.choice == 0).length;

                return (
                  <Grid item xs={12} sm={6} md={3} key={part}>
                    <NoBadge className={classes.otherBadge} badgeContent={no}>
                      <YesBadge
                        className={classes.firstBadge}
                        badgeContent={yes}
                      >
                        {part}
                      </YesBadge>
                    </NoBadge>
                    <List dense>
                      {
                        // Separate list items by each member attendance
                        partAttendance.map((attend) => {
                          const member = members.find(
                            (x) => x.userData.memberId == attend.memberId
                          );
                          const userData =
                            member && member.userData
                              ? member.userData
                              : undefined;
                          const choice =
                            attend.choice == 1 ? (
                              <ThumbUpIcon className={classes.yes} />
                            ) : attend.choice == 0 ? (
                              <ThumbDownIcon className={classes.no} />
                            ) : (
                              ''
                            );
                          return userData ? (
                            <ListItem
                              className={classes.listItem}
                              key={attend.memberId}
                            >
                              <ListItemAvatar>
                                {userData.pictureUrl ? (
                                  <Avatar
                                    src={userData.pictureUrl}
                                    alt={userData.firstName}
                                  />
                                ) : (
                                  <Avatar>
                                    <PersonIcon />
                                  </Avatar>
                                )}
                              </ListItemAvatar>
                              <ListItemText
                                className={classes.listText}
                                primary={`${userData.firstName} ${userData.lastName}`}
                              />
                              {choice}
                            </ListItem>
                          ) : undefined;
                        })
                      }
                    </List>
                    {showUnattended ? (
                      <List dense>
                        {unattended
                          .filter((x) => x.userData.part == part)
                          .map((member) => (
                            <ListItem
                              className={classes.listItem}
                              key={member.userData.memberId}
                            >
                              <ListItemAvatar>
                                {member.userData.pictureUrl ? (
                                  <Avatar
                                    src={member.userData.pictureUrl}
                                    alt={member.userData.firstName}
                                  />
                                ) : (
                                  <Avatar>
                                    <PersonIcon />
                                  </Avatar>
                                )}
                              </ListItemAvatar>
                              <ListItemText
                                className={`${classes.unattendedListText} ${classes.listText}`}
                                primary={`${member.userData.firstName} ${member.userData.lastName}`}
                              />
                              <RemoveIcon />
                            </ListItem>
                          ))}
                      </List>
                    ) : undefined}
                  </Grid>
                );
              })
            }
          </Grid>
        ) : undefined}
      </Grid>
    );
  }
}

AttendanceList.propTypes = {
  classes: PropTypes.object.isRequired,
  eventAttendance: PropTypes.object,
};

export default withStyles(styles)(AttendanceList);
