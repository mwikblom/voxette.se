import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const styles = theme => ({
    imgContainer: {
        marginTop: theme.spacing.unit * 3,
        textAlign: 'center',
    },
    img: {
        maxWidth: '100%',
        maxHeight: '300px'
    }
});

class Home extends Component {

    render() {

        const { classes } = this.props;

        return (
            <div>
                <h1>Välkommen till KFUM Voxette!</h1>
                <p>Vi är en kör bestående av enbart skönsjungande damer. </p>
                <p>Leder oss med läderpiska och ett sjuhelsikes engagemang gör sång-, kör- och musikteoripedagogen Anna Wikblom utbildad vid musikhögskolan i Örebro.</p>
                <p>KFUM Voxette, Örebro grundades i januari 1997 av en handfull sångentusiaster ur en av Medborgarskolans körkurser. Kören sökte medlemskap i KFUM för att 
                    få en officiell föreningstillhörighet. Vi repeterar i Betaniakyrkan på Venavägen 21 på norr i Örebro.</p>
                <p>Vi har en bred repertoar med allt från psalmer, klassiskt, visor och pop till lättsammare sånger för festliga tillfällen. Voxette framträder både i 
                    offentliga och privata sammanhang och har med tiden blivit mer &quot;kända&quot; vilket innebär förfrågningar av de mest skiftande slag. Det kan variera med allt 
                    från sångarting, luciatåg, personalfester till gästspel i kyrkor. Vi har även gjort en direktsänd radiokonsert i P4.</p>
                <p>Varje vår avslutar vi med en stor konsert i varierande tema, ofta tillsammans 
                    med inhyrd solist, grupp eller musiker. Vi har bl a gjort konserter med Norrköpingsbandet 
                    Liverpool för att tillsammans med dem frossa i Beatlessånger och vi har sjungit 
                    Vivaldis Gloria med stråkensemble.</p>
                <p><strong>Vill du vara med?</strong> Just nu tar vi inte in nya medlemmar.</p>
                <p>Vill du boka oss finns mer information på vår <Link className={classes.navLink} to="/kontakt">Kontaktsida</Link></p>
                <div className={classes.imgContainer}>
                    <img alt="Voxette" src="/images/IMG_3373.jpg" className={classes.img} />
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Home);
