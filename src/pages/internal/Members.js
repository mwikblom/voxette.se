import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FirebaseApp from '../../FirebaseApp';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Person as PersonIcon
} from '@material-ui/icons';
import { 
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    Chip,
    CircularProgress,
    Avatar
} from '@material-ui/core';
import Constants from '../../common/Constants';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflow: 'hidden',
        padding: theme.spacing.unit * 2
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
        float: 'right'
    }, 
    input: {
        display: 'none',
    },
    textField: {
        width: '100%',
    },
    chipRoot: {
        whiteSpace: 'nowrap',
    },    
    chip: {
        margin: theme.spacing.unit / 2,
    },    
    wrapper: {
        marginTop: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    tableContainer: {
        overflowX: 'auto'
    },
    lessPadding: {
        paddingRight: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit
    },
    nameCell: {
        minWidth: 200,
        paddingLeft: 0
    }
});

function memberUri(memberId) {
    return '/inloggad/medlem/' + memberId;
}

class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            filterName: '',
            filterTag: '',
            filterPart: '',
            addOpen: false,
            newMemberEmail: '',
            loading: false,
            disabled: false
        };
    }

    search(e) {
        const { filterName, filterTag, filterPart } = this.state;

        e.preventDefault();

        this.setState({
            loading: true,
            disabled: true
        });

        FirebaseApp.voxette.fetchMembers(filterName, filterTag, filterPart, (members) => {
            if (members) {
                this.setState({
                    members: members
                });
            }
            this.setState({
                loading: false,
                disabled: false
            });
        });
    }

    render() {
        const { classes } = this.props;
        const { members, filterName, filterTag, filterPart, addOpen, loading, disabled } = this.state;

        return ( 
            <div>
                <h1>Medlemmar</h1>
                <p>
                    Här är körens medlemsregister. Du kan söka genom att klicka på sökknappen, då listas samtliga medlemmar i kören.
                    Du kan även begränsa sökningen genom att ange första delen av förnamnet. Börja med stor bokstav; exemelvis hittas
                    Anna genom att ange 'A'. Det är också möjligt att begränsa sökningen genom att filtrera på en 'tagg' eller 
                    stämtillhörighet.
                </p>
                <h3>GDPR</h3>
                <p>
                    Uppgifterna kommer endast användas som kontaktinformation för Voxette och dess medlemmar. Informationen kommer aldrig 
                    säljas eller skickas vidare till tredje part. Endast de uppgifter som behövs för att kontakta medlemmarna samlas in.
                    Var och en i kören ansvarar för att uppgifterna är korrekta och relevanta. Uppgifterna kommer tas bort så snart en 
                    medlem ej längre är aktiv såvida personen själv inte önskar ta del av utskick.
                </p>
                
                <Paper className={classes.root}>
                    <Tooltip title="Lägg till ny medlem">
                        <Button variant="fab" component="span" color="secondary" aria-label="add" className={classes.button} onClick={this.handleClickOpen}>
                            <AddIcon/>
                        </Button>
                    </Tooltip>

                    <Dialog
                        open={addOpen}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                        >
                        <DialogTitle id="form-dialog-title">Ny medlem</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            Lägg till epost till den nya medlemmen. Eposten måste överensstämma med den inloggningsmetod som ska användas.
                            Om exemelvis gmail används som inloggning måste det vara en gmail-adress.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Email"
                                type="email"
                                fullWidth
                                onChange={(event) => this.handleChange(event, 'newMemberEmail')}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.handleClose(false)}>
                                Avbryt
                            </Button>
                            <Button onClick={() => this.handleClose(true)} color="primary">
                                Lägg till
                            </Button>
                        </DialogActions>
                    </Dialog>
                   
                    <form onSubmit={(e) => this.search(e)}>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    id="name"
                                    label="Förnamn"
                                    className={classes.textField}
                                    value={filterName}
                                    onChange={(event) => this.handleChange(event, 'filterName')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    id="tag"
                                    select
                                    label="Tagg"
                                    className={classes.textField}
                                    value={filterTag}
                                    onChange={(event) => this.handleChange(event, 'filterTag')}
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    margin="normal"
                                >
                                    <MenuItem value="">
                                        <em>Alla</em>
                                    </MenuItem>
                                    {Constants.tagValues.map(tag => (
                                        <MenuItem key={tag} value={tag}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    id="part"
                                    select
                                    label="Stämma"
                                    className={classes.textField}
                                    value={filterPart}
                                    onChange={(event) => this.handleChange(event, 'filterPart')}
                                    margin="normal"
                                >
                                    <MenuItem value="">
                                        <em>Alla</em>
                                    </MenuItem>
                                    {Constants.partValues.map(part => (
                                        <MenuItem key={part} value={part}>
                                            {part}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>    
                        <div className={classes.wrapper}>
                            <Tooltip title="Sök efter medlemmar">
                                <Button type="submit" variant="contained" color="primary" disabled={disabled}>
                                    <SearchIcon />
                                </Button>                                         
                            </Tooltip>
                            {loading && <CircularProgress size={40} className={classes.buttonProgress} />}
                        </div>
                    </form>

                    <div className={classes.tableContainer}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Namn</TableCell>
                                    <TableCell>Stämma</TableCell>
                                    <TableCell>Taggar</TableCell>
                                    <TableCell>Telefon</TableCell>
                                    <TableCell>Epost</TableCell>
                                    <TableCell>Adress</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {members.map(member => {
                                    return (
                                        <TableRow hover key={member.userData.memberId}>
                                            <TableCell className={classes.lessPadding}>
                                                <Link to={memberUri(member.userData.memberId)}>
                                                    <Tooltip title="Ändra uppgifter">
                                                        <EditIcon className={classes.action} />
                                                    </Tooltip>
                                                </Link>
                                            </TableCell>
                                            <TableCell component="th" scope="row" className={classes.nameCell}>
                                                <Grid container spacing={8} alignItems="center">
                                                    <Grid item>
                                                        {
                                                            member.userData.pictureUrl
                                                            ? <Avatar src={member.userData.pictureUrl} alt={member.userData.firstName} />
                                                            : <Avatar>
                                                                <PersonIcon />
                                                            </Avatar>
                                                        }
                                                    </Grid>
                                                    <Grid item xs={12} sm>
                                                        {member.userData.firstName} {member.userData.lastName}
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell className={classes.chipRoot}>
                                                {
                                                    member.userData.part
                                                    ? <Chip
                                                        color="primary"
                                                        key={member.userData.part}
                                                        label={member.userData.part}
                                                        className={classes.chip}
                                                    />
                                                    : undefined
                                                }
                                            </TableCell>
                                            <TableCell className={classes.chipRoot}>
                                                {member.userData.tags && member.userData.tags.map(tag => {
                                                    return (
                                                        <Chip
                                                            key={tag}
                                                            label={tag}
                                                            className={classes.chip}
                                                        />
                                                    );        
                                                })}
                                            </TableCell>
                                            <TableCell>{member.userData.phone}</TableCell>
                                            <TableCell>{member.userData.email}</TableCell>
                                            <TableCell>{member.userData.address}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Paper>            
            </div>
        );
    }

    handleClickOpen = () => {
        this.setState({ addOpen: true });
    }
    
    handleClose = (save) => {

        const { newMemberEmail } = this.state; 

        if (!newMemberEmail) {
            this.setState({ addOpen: false });
        }

        if (save) {
            FirebaseApp.voxette.addMember(newMemberEmail, () => {
                this.setState({ 
                    addOpen: false,
                    newMemberEmail: ''
                });
            });
        } else {
            this.setState({ 
                addOpen: false,
                newMemberEmail: ''
            });
        }
    }

    handleChange(event, name) {
        this.setState({
            [name]: event.target.value
        });
    }   
}

Members.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Members);