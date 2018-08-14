import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    success: {
        backgroundColor: green[600],
      },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },    
});

// TODO fix colors

class Message extends Component {

    constructor(props) {
        super(props);
		
        this.state = {
            open: true
        };

        console.log('Message is open: ' + this.state.open + ' text is ' + props.text);
    }
    
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({ open: false });
    }

    render() {
        const { classes, variant, text } = this.props;
        const Icon = variantIcon[variant];
        const { open } = this.state;
        const hideDuration = variant === 'warning' || variant === 'error' ? null : 7000;

        return (open && text !== undefined) ? (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                className={classNames(classes[variant])}
                open={open}
                autoHideDuration={hideDuration}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <Icon className={classNames(classes.icon, classes.iconVariant)} />
                        {text}
                    </span>                    
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={this.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />                
            )
            : null;
    }

}

Message.propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    text: PropTypes.string,
};

export default withStyles(styles)(Message);