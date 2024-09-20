import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  imgContainer: {
    marginTop: theme.spacing.unit * 3,
    textAlign: 'center',
  },
  img: {
    maxWidth: '100%',
  },
});

class Home extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Välkommen till KFUM Voxette!</h1>
        <p>
          KFUM Voxette grundades i januari 1997 av en handfull sångentusiaster ur en av Medborgarskolans körkurser och har utvecklats till en 45 kvinnor kompetent ensemble. Sedan millennieskiftet leds vi med kärlek och piska av sång-, kör- och musikteoripedagogen Anna Wikblom, utbildad vid musikhögskolan i Örebro. Vår repertoar är bred, vår målsättning är att beröra i ton och närvaro och musicera på hög nivå, oavsett klassiskt, visa eller pop. Och där livet får plats.
        </p>
        <p>
          Bland våra mest uppskattade produktioner kan bland annat nämnas Hennes Röst, med musik av kvinnliga diktare, tonsättare och artister som framfördes på Örebro slott samt Live at heart 2024. Vi ser också fram emot ett samarbete med vokalgruppen Solala på Örebro konserthus 24:e november 2024 - <a href="https://www.ticketmaster.se/event/i-langtan-efter-julen-konsert-med-solala-och-koren-voxette-tickets/663061" target="_blank">&quot;I längtan efter julen&quot;</a>.
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
        <div className={classes.imgContainer}>
          <img
            alt="Voxette. En damkör klädd i orange, rosa och rött"
            src="/images/Voxette-hennes-rost-2024.jpg"
            className={classes.img}
          />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
