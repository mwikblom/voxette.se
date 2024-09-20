import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  img: {
    float: 'right',
    marginLeft: theme.spacing.unit,
  },
});

class Conductor extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Anna Wikblom</h1>
        <div className={classes.img}>
          <img alt="Anna Wikblom" src="/images/anna2.jpg" height="150px" />
        </div>
        <p>
          Anna Wikblom är utbildad i sång och kördirigering vid Musikhögskolan i
          Örebro, där hon studerat för Solvieg Ågren och barocksångerskan 
          Susanne Rydén (Stockholm). Hon har många års musikpedagogisk erfarenhet 
          som sång-, kör- och musikteorilärare.
        </p>
        <p>
          Utöver det lustfyllda uppdraget som körledare för damkören Voxette 
          frilansar Anna som sångerska och körpedagog. Som körsopran sjunger 
          hon i Mats Bertilssons vokalensemble Olaus Petri Vocalis, och har 
          under Solvieg Ågren tidigare även sjungit i kammarkören Stella. 
          Annas repertoar är rik och består av allt från äldre till nyskriven 
          musik, med ett hjärta som klappar extra för barockens tonsättare, 
          den tyska Liederrepertoaren, nordisk nationalromantisk sånglyrik samt 
          nutida musik.
        </p>
        <p>
          Anna är körens ledare sedan 2001, trots att arbetslivet gjort ett par 
          rejäla 180-gradssvängar. Sedan 2017 jobbar Anna som läkare, inom kort 
          färdig specialist i allmänmedicin.
        </p>
      </div>
    );
  }
}

Conductor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Conductor);
