import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirebaseApp from '../../FirebaseApp';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from 'react-router-dom';
import {
  ListSubheader,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  Select,
  Chip,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import Constants from './../../common/Constants';
import { Modal } from '@material-ui/core';

const styles = (theme) => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    padding: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '100%',
  },
  action: {
    marginRight: theme.spacing(3),
  },
  delete: {
    float: 'right',
  },
  formControl: {
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
  buttonIcon: {
    marginRight: theme.spacing(),
  },
  formDropdown: {
    marginTop: theme.spacing(2),
  },
  deleteModal: {
    position: 'absolute',
    top: 'calc(50% - 50px)',
    left: 'calc(50% - 150px)',
    width: '300px',
    maxWidth: '100%',
    background: 'white',
    boxShadow: '0 0 10px #555',
    padding: theme.spacing(2),
  },
  optGroup: {
    background: '#fff',
    paddingRight: theme.spacing(),
    paddingLeft: theme.spacing(),
  },
});

// TODO duplicated in Files.js
function humanFileSize(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class File extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasChanges: false,
      name: '',
      size: '',
      type: '',
      fileType: '',
      isCurrent: false,
      tags: [],
      categories: [],
      allCategories: [],
      allTags: [],
      deleteModalIsOpen: false,
    };
  }

  componentDidMount() {
    const { fullPath } = this.props;

    FirebaseApp.voxette.fetchFileData(fullPath, (fileData) => {
      if (fileData) {
        this.setState(fileData);
        this.setState({
          hasChanges: false,
        });
      }
    });

    this.setState({
      allCategories: Constants.fileCategories,
      allTags: Constants.fileTags,
    });
  }

  render() {
    const { classes } = this.props;
    const {
      name,
      size,
      type,
      fileType,
      isCurrent,
      tags,
      categories,
      hasChanges,
      allCategories,
      deleteModalIsOpen,
    } = this.state;

    // Rebuild the tag group structure to one flat array containing both the groups and values,
    // since Selects require the MenuItems to be direct children...
    const flattenedTags = this.state.allTags.flatMap((tagGroup) => [
      {
        isGroup: true,
        label: tagGroup.name,
      },
      ...tagGroup.tags.map((tag) => ({
        isGroup: false,
        label: tag,
      })),
    ]);

    return (
      <div>
        <h1>Fil</h1>
        <Paper className={classes.paper}>
          <form
            className={classes.container}
            noValidate
            autoComplete="off"
            onSubmit={(e) => this.saveChanges(e)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="name"
                  label="Namn"
                  className={classes.textField}
                  value={name}
                  error={!name}
                  onChange={(event) => this.handleChange(event, 'name')}
                  margin="normal"
                  autoFocus
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={`${classes.formControl} ${classes.formDropdown}`}
                >
                  <InputLabel htmlFor="file-type-chip">Typ</InputLabel>
                  <Select
                    value={fileType}
                    onChange={(event) => this.handleChange(event, 'fileType')}
                    MenuProps={MenuProps}
                  >
                    {Constants.fileTypes.map((fileType) => (
                      <MenuItem key={fileType} value={fileType}>
                        {fileType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="categories-chip">Kategorier</InputLabel>
                  <Select
                    multiple
                    value={categories}
                    onChange={(event) => this.handleChange(event, 'categories')}
                    input={<Input id="categories-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {allCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="tags-chip">Taggar</InputLabel>
                  <Select
                    multiple
                    value={tags}
                    onChange={(event) => this.handleChange(event, 'tags')}
                    input={<Input id="tags-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {flattenedTags.map((tag) =>
                      tag.isGroup ? (
                        <ListSubheader className={classes.optGroup} key={tag.label}>
                          {tag.label}
                        </ListSubheader>
                      ) : (
                        <MenuItem key={tag.label} value={tag.label}>
                          {tag.label}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isCurrent}
                      onChange={(event) =>
                        this.handleCheckedChange(event, 'isCurrent')
                      }
                    />
                  }
                  label="Aktuell"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="size"
                  label="Storlek"
                  className={classes.textField}
                  value={humanFileSize(size)}
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="type"
                  label="Typ"
                  className={classes.textField}
                  value={type}
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  className={classes.action}
                  variant="contained"
                  to="/inloggad/filer"
                >
                  <CancelIcon className={classes.buttonIcon} />
                  Stäng
                </Button>
                <Button
                  className={classes.action}
                  variant="contained"
                  color="primary"
                  disabled={!hasChanges}
                  type="submit"
                >
                  <SaveIcon className={classes.buttonIcon} />
                  Spara ändringar
                </Button>
                <Button
                  className={classes.delete}
                  onClick={() => this.toggleDeleteModal()}
                  color="secondary"
                >
                  Ta bort
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Modal open={deleteModalIsOpen} onClose={() => this.toggleDeleteModal}>
          <div className={classes.deleteModal}>
            <p>Är du säker på att du vill ta bort filen?</p>
            <Button
              className={classes.action}
              color="secondary"
              onClick={() => this.toggleDeleteModal()}
            >
              Avbryt
            </Button>
            <Button
              className={classes.action}
              color="primary"
              onClick={() => this.deleteFile()}
            >
              Ta bort
            </Button>
          </div>
        </Modal>
      </div>
    );
  }

  handleChange(event, name) {
    this.setState({
      [name]: event.target.value,
      hasChanges: true,
    });
  }

  handleCheckedChange(event, name) {
    this.setState({
      [name]: event.target.checked,
      hasChanges: true,
    });
  }

  saveChanges(e) {
    const { fullPath } = this.props;
    const { name, fileType, isCurrent, tags, categories } = this.state;

    e.preventDefault();

    if (name) {
      FirebaseApp.voxette.saveFileData(
        fullPath,
        name,
        fileType,
        isCurrent,
        tags,
        categories,
        () => {
          this.setState({
            hasChanges: false,
          });
        }
      );
    }
  }

  toggleDeleteModal() {
    const { deleteModalIsOpen } = this.state;
    this.setState({ deleteModalIsOpen: !deleteModalIsOpen });
  }

  deleteFile() {
    const { fullPath } = this.props;
    FirebaseApp.voxette.deleteFile(fullPath, () =>
      this.props.history.push('/inloggad/filer')
    );
  }
}

File.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  fullPath: PropTypes.string.isRequired,
};

export default withRouter(withStyles(styles)(File));
