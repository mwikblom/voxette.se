import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid } from "@material-ui/core";

const styles = (theme) => ({
  imgContainer: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    }
  },
  img: {
    width: '100%',
  },
});

class Home extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Välkommen till Voxette!</h1>
        <Grid container spacing={4}>
          <Grid item sm={6}>
            <p>
              Örebros damkör Voxette grundades i januari 1997 av en handfull sångentusiaster ur en av Medborgarskolans körkurser och har utvecklats till en 45 kvinnor kompetent ensemble. Sedan millennieskiftet leds vi med kärlek och piska av sång-, kör- och musikteoripedagogen Anna Wikblom, utbildad vid musikhögskolan i Örebro. Vår repertoar är bred, vår målsättning är att beröra i ton och närvaro och musicera på hög nivå, oavsett klassiskt, visa eller pop. Och där livet får plats.
            </p>
            <p>
              Bland våra mest uppskattade produktioner kan bland annat nämnas Hennes Röst, med musik av kvinnliga diktare, tonsättare och artister som framfördes på Örebro slott samt Live at heart 2024 och vårt samarbete med vokalgruppen Solala på Örebro konserthus; I längtan efter julen. Följ oss gärna på <a href="https://facebook.com/ChoirVoxette" target="_blank">facebook</a> för att hålla dig uppdaterad om våra konserter.
            </p>
            <p>
              <strong>Vill du vara med?</strong> Just nu är kören fulltalig och vi tar inte in fler medlemmar.
            </p>
            <p>
              Vill du boka oss finns mer information på vår{' '}
              <Link className={classes.navLink} to="/kontakt">
                Kontaktsida
              </Link>
            </p>
          </Grid>
          <Grid item sm={6}>
            <div className={classes.imgContainer}>
              <img
                alt="Gruppbild på kören Voxette. En 40-tal glada kvinnor klädda i orange, rosa och rött"
                src="/images/Voxette-hennes-rost-2024.jpg"
                className={classes.img}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
