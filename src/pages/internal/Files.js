import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FirebaseApp from '../../FirebaseApp';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
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
  Tooltip,
  Chip,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Fab,
} from '@material-ui/core/';
import { Check as CheckIcon } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import Constants from '../../common/Constants';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  table: {
    minWidth: 700,
    marginTop: theme.spacing(2),
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
  checkbox: {
    marginBottom: theme.spacing(2),
  },
  checkIcon: {
    color: green[400],
  },
  action: {
    cursor: 'pointer',
  },
  chipRoot: {
    whiteSpace: 'nowrap',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -83,
    marginLeft: 149,
  },
  isCurrentCell: {
    width: theme.spacing(6.25),
  },
  editCell: {
    width: theme.spacing(9),
  },
  sizeCell: {
    width: theme.spacing(12.5),
  },
});

function humanFileSize(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

function fileUri(fullPath) {
  return '/inloggad/fil/' + fullPath;
}

function downloadFileUri(fullPath) {
  return '/inloggad/ladda-ned/' + fullPath;
}

class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      selectedFullPath: null,
      loading: false,
      disabled: false,
      filterName: '',
      filterType: Constants.notes,
      filterIsCurrent: true,
      filterTag: '',
      filterCategory: '',
      allCategories: [],
      allTags: [],
    };
  }

  componentDidMount() {
    this.setState({
      allCategories: Constants.fileCategories,
      allTags: Constants.fileTags,
    });
  }

  search(e) {
    const {
      filterName,
      filterType,
      filterIsCurrent,
      filterTag,
      filterCategory,
    } = this.state;

    e.preventDefault();

    if (
      !filterName &&
      !filterType &&
      !filterIsCurrent &&
      !filterTag &&
      !filterCategory
    ) {
      return;
    }
    this.setState({
      loading: true,
      disabled: true,
    });

    FirebaseApp.voxette.fetchFiles(
      filterName,
      filterType,
      filterIsCurrent,
      filterTag,
      filterCategory,
      (files) => {
        if (files) {
          this.setState({
            files: files,
          });
        }
        this.setState({
          loading: false,
          disabled: false,
        });
      }
    );
  }

  handleFiles(event) {
    const files = event.target.files;

    for (var i = 0; i < files.length; i++) {
      const file = files[i];
      const fullPath = new Date().getTime() + '_' + file.name;

      FirebaseApp.voxette.uploadFile(fullPath, file, (data) => {
        const newFiles = this.state.files.splice(0);

        newFiles.unshift(data);

        this.setState({
          files: newFiles,
        });
      });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      files,
      filterName,
      filterType,
      filterIsCurrent,
      filterTag,
      filterCategory,
      editable,
      loading,
      disabled,
      allCategories,
      allTags,
    } = this.state;

    const searchDisabled =
      disabled ||
      (!filterName &&
        !filterType &&
        !filterIsCurrent &&
        !filterCategory &&
        !filterTag);

    const nameField = function (file) {
      return editable && editable === file.fullPath ? (
        <strong>{file.name}</strong>
      ) : (
        file.name
      );
    };

    return (
      <div>
        <h1>Filer</h1>
        <p>
          Här kan du hitta noter, stämfiler och annat. Du kan söka genom att
          klicka på sökknappen; då listas samtliga filer som matchar
          sökkriterierna. Du kan även begränsa sökningen genom att ange första
          delen av filnamnet, exemelvis hittas DotterSion.pdf genom att ange
          "do". Det är också möjligt att begränsa sökningen genom att filtrera
          på en "typ", exempelvis noter och ljudfiler, kategori eller tagg. Är
          valet "Visa endast aktuella" markerad så kommer resultaten endast
          innehålla filer som är markerade som aktuella just nu.
        </p>
        <p>
          För att lägga till nya filer använder du den gröna knappen med plus.
          PDF-filer kommer automatiskt taggas som noter, audio-format såsom MP3
          taggas som ljudfiler och bild-format som bilder. Övriga filtyper
          taggas som övrigt. När filen är uppladdad kan du klicka på pennan om
          du vill ändra filens namn eller övrig info.
        </p>

        <Paper className={classes.root}>
          <input
            accept="*/*"
            className={classes.input}
            id="upload-input"
            multiple
            type="file"
            onChange={(event) => this.handleFiles(event)}
          />
          <label htmlFor="upload-input">
            <Tooltip title="Lägg till nya filer">
              <Fab
                component="span"
                color="secondary"
                aria-label="add"
                className={classes.button}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </label>

          <div>
            <form onSubmit={(e) => this.search(e)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    id="name"
                    label="Namn"
                    className={classes.textField}
                    value={filterName}
                    onChange={(event) => this.handleChange(event, 'filterName')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    id="type"
                    select
                    label="Typ"
                    className={classes.textField}
                    value={filterType}
                    onChange={(event) => this.handleChange(event, 'filterType')}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                  >
                    <option value=""></option>
                    {Constants.fileTypes.map((fileType) => (
                      <option key={fileType} value={fileType}>
                        {fileType}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    id="category"
                    select
                    label="Kategori"
                    className={classes.textField}
                    value={filterCategory}
                    onChange={(event) =>
                      this.handleChange(event, 'filterCategory')
                    }
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                  >
                    <option value=""></option>
                    {allCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    id="tag"
                    select
                    label="Tagg"
                    className={classes.textField}
                    value={filterTag}
                    onChange={(event) => this.handleChange(event, 'filterTag')}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                  >
                    <option value=""></option>
                    {allTags.map((tagGroup) => (
                      <optgroup label={tagGroup.name} key={tagGroup.name}>
                        {tagGroup.tags.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterIsCurrent}
                        onChange={(event) =>
                          this.handleCheckedChange(event, 'filterIsCurrent')
                        }
                      />
                    }
                    label="Visa endast aktuella"
                    className={classes.checkbox}
                  />
                </Grid>
              </Grid>
              <Tooltip title="Sök efter filer">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={searchDisabled}
                  color="primary"
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
            </form>
          </div>

          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Namn</TableCell>
                <TableCell>Filtyp</TableCell>
                <TableCell>Kategorier</TableCell>
                <TableCell>Taggar</TableCell>
                <TableCell>Aktuell</TableCell>
                <TableCell>Storlek</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => {
                return (
                  <TableRow hover key={file.fullPath}>
                    <TableCell>
                      <Tooltip title="Öppna fil">
                        <a
                          href={downloadFileUri(file.fullPath)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {nameField(file)}
                        </a>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{file.fileType}</TableCell>
                    <TableCell className={classes.chipRoot}>
                      {file.categories &&
                        file.categories.map((category) => {
                          return (
                            <Chip
                              key={category}
                              label={category}
                              className={classes.chip}
                            />
                          );
                        })}
                    </TableCell>
                    <TableCell className={classes.chipRoot}>
                      {file.tags &&
                        file.tags.map((tag) => {
                          return (
                            <Chip
                              key={tag}
                              label={tag}
                              className={classes.chip}
                            />
                          );
                        })}
                    </TableCell>
                    <TableCell className={classes.isCurrentCell}>
                      {file.isCurrent ? (
                        <CheckIcon className={classes.checkIcon} />
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell className={classes.sizeCell}>
                      {humanFileSize(file.size)}
                    </TableCell>
                    <TableCell className={classes.editCell}>
                      <Tooltip title="Ändra filens namn eller taggar">
                        <a href={fileUri(file.fullPath)}>
                          <EditIcon className={classes.action} />
                        </a>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  handleChange(event, name) {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleCheckedChange(event, name) {
    this.setState({
      [name]: event.target.checked,
    });
  }

  // handleClickDownload = fullPath => {
  // FirebaseApp.voxette.getDownloadUrl(fullPath, (url) => {
  //     window.open(url); // just open in new tab for now. Might be better to download due to bandwidth

  //     /*var xhr = new XMLHttpRequest();
  //     xhr.responseType = 'blob';
  //     xhr.onload = function(event) {
  //         var blob = xhr.response;

  //     };
  //     xhr.open('GET', url);
  //     xhr.send();*/
  // });
  // }
}

Files.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Files);
