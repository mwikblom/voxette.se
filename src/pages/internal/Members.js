import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FirebaseApp from '../../FirebaseApp';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from '@material-ui/icons';
import {
  Fab,
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
  Avatar,
} from '@material-ui/core';
import Constants from '../../common/Constants';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflow: 'hidden',
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 700,
  },
  button: {
    margin: theme.spacing(),
    float: 'right',
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
    margin: theme.spacing(0.5),
  },
  wrapper: {
    marginTop: theme.spacing(),
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing(),
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
    overflowX: 'auto',
    marginTop: theme.spacing(2),
  },
  lessPadding: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(),
  },
  nameCell: {
    minWidth: 200,
    paddingLeft: 0,
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(0.5),
      alignItems: 'flex-start',
    }
  },
  name: {
    flexGrow: 1,
  },
  avatar: {
    flexShrink: 0,
  },
  newMemberHeading: {
    margin: 0,
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
      allergiesOpen: false,
      newMemberEmail: '',
      newMemberPassword: '',
      loading: false,
      disabled: false,
    };
  }

  search(e) {
    const { filterName, filterTag, filterPart } = this.state;

    e.preventDefault();

    this.setState({
      loading: true,
      disabled: true,
    });

    FirebaseApp.voxette.fetchMembers(
      filterName,
      filterTag,
      filterPart,
      (members) => {
        if (members) {
          this.setState({
            members: members,
          });
        }
        this.setState({
          loading: false,
          disabled: false,
        });
      }
    );
  }

  render() {
    const { classes } = this.props;
    const {
      members,
      filterName,
      filterTag,
      filterPart,
      addOpen,
      allergiesOpen,
      loading,
      disabled,
    } = this.state;
    const allergiesDisabled = members === undefined || members.length <= 0;

    return (
      <div>
        <h1>Medlemmar</h1>
        <p>
          Här är körens medlemsregister. Du kan söka genom att klicka på
          sökknappen, då listas samtliga medlemmar i kören. Du kan även begränsa
          sökningen genom att ange första delen av förnamnet. Börja med stor
          bokstav; exemelvis hittas Anna genom att ange 'A'. Det är också
          möjligt att begränsa sökningen genom att filtrera på en 'tagg' eller
          stämtillhörighet.
        </p>
        <h2>GDPR</h2>
        <p>
          Uppgifterna kommer endast användas som kontaktinformation för Voxette
          och dess medlemmar. Informationen kommer aldrig säljas eller skickas
          vidare till tredje part. Endast de uppgifter som behövs för att
          kontakta medlemmarna samlas in. Var och en i kören ansvarar för att
          uppgifterna är korrekta och relevanta. Uppgifterna kommer tas bort så
          snart en medlem ej längre är aktiv såvida personen själv inte önskar
          ta del av utskick.
        </p>

        <Paper className={classes.root}>
          <Tooltip title="Lägg till ny medlem">
            <Fab
              component="span"
              color="secondary"
              aria-label="add"
              className={classes.button}
              onClick={this.handleAddClickOpen}
            >
              <AddIcon />
            </Fab>
          </Tooltip>

          <Dialog
            open={addOpen}
            onClose={() => this.handleClose(false)}
            aria-labelledby="new-member-title"
          >
            <DialogTitle id="new-member-title" disableTypography>
              <h2 className={classes.newMemberHeading}>
                Ny medlem
              </h2>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Lägg till epost till den nya medlemmen. Gmail eller epost och
                lösenord kan användas för inlogging. Om medlemen vill logga in
                med Gmail behövs bara eposten om hon vill använda sig av epost
                och lösenord måste epost och hennes initiala lösenord anges.
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
              <TextField
                margin="dense"
                id="password"
                label="Initialt lösenord"
                type="text"
                fullWidth
                onChange={(event) =>
                  this.handleChange(event, 'newMemberPassword')
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose(false)}>Avbryt</Button>
              <Button onClick={() => this.handleClose(true)} color="primary">
                Lägg till
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={allergiesOpen && !allergiesDisabled}
            onClose={this.handleCloseAlergies}
            aria-labelledby="allergy-title"
          >
            <DialogTitle id="allergy-title">
              Allergier och matpreferenser
            </DialogTitle>
            <DialogContent>
              {members.map(
                (member) =>
                  member.userData.allergies && (
                    <DialogContentText key={member.userData.memberId}>
                      <b>
                        {member.userData.firstName} {member.userData.lastName}
                      </b>{' '}
                      - {member.userData.allergies}
                    </DialogContentText>
                  )
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseAlergies}>Stäng</Button>
            </DialogActions>
          </Dialog>

          <form onSubmit={(e) => this.search(e)}>
            <Grid container spacing={2}>
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
                  {Constants.tagValues.map((tag) => (
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
                  {Constants.partValues.map((part) => (
                    <MenuItem key={part} value={part}>
                      {part}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <div className={classes.wrapper}>
              <Tooltip title="Sök efter medlemmar">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={disabled}
                >
                  <SearchIcon />
                </Button>
              </Tooltip>
              {loading && (
                <CircularProgress
                  size={40}
                  className={classes.buttonProgress}
                />
              )}
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                disabled={allergiesDisabled}
                onClick={this.handleAllergiesClickOpen}
              >
                Visa allergier för framsökta
              </Button>
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
                {members.map((member) => {
                  return (
                    <TableRow hover key={member.userData.memberId}>
                      <TableCell className={classes.lessPadding}>
                        <Link to={memberUri(member.userData.memberId)}>
                          <Tooltip title="Ändra uppgifter">
                            <EditIcon className={classes.action} />
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.nameCell}
                      >
                        <div className={classes.nameContainer}>
                          {member.userData.pictureUrl ? (
                            <Avatar
                              className={classes.avatar}
                              src={member.userData.pictureUrl}
                              alt={member.userData.firstName}
                            />
                            ) : (
                              <Avatar className={classes.avatar}>
                                <PersonIcon />
                              </Avatar>
                            )
                          }
                          <span className={classes.name}>{`${member.userData.firstName} ${member.userData.lastName}`}</span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.chipRoot}>
                        {member.userData.part ? (
                          <Chip
                            color="primary"
                            key={member.userData.part}
                            label={member.userData.part}
                            className={classes.chip}
                          />
                        ) : undefined}
                      </TableCell>
                      <TableCell className={classes.chipRoot}>
                        {member.userData.tags &&
                          member.userData.tags.map((tag) => {
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

  handleAddClickOpen = () => {
    this.setState({ addOpen: true });
  };

  handleAllergiesClickOpen = () => {
    this.setState({ allergiesOpen: true });
  };

  handleCloseAlergies = () => {
    this.setState({ allergiesOpen: false });
  };

  handleClose = (save) => {
    const { newMemberEmail, newMemberPassword } = this.state;

    if (!newMemberEmail) {
      this.setState({ addOpen: false });
    }

    if (save) {
      FirebaseApp.voxette.addMember(newMemberEmail, newMemberPassword, () => {
        this.resetNewMember();
      });
    } else {
      this.resetNewMember();
    }
  };

  handleChange(event, name) {
    this.setState({
      [name]: event.target.value,
    });
  }

  resetNewMember() {
    this.setState({
      addOpen: false,
      allergiesOpen: false,
      newMemberEmail: '',
      newMemberPassword: '',
    });
  }
}

Members.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Members);
