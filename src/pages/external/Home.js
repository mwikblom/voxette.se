import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    img: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        textAlign: 'center',
        padding: theme.spacing.unit
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
                    få en officiell föreningstillhörighet och det är i KFUMs lokaler på Borgmästaregatan 9 i Örebro som vi har våra repetitioner.</p>
                <p>Vi har en bred repertoar med allt från psalmer, klassiskt, visor och pop till lättsammare sånger för festliga tillfällen. Voxette framträder både i 
                    offentliga och privata sammanhang och har med tiden blivit mer &quot;kända&quot; vilket innebär förfrågningar av de mest skiftande slag. Det kan variera med allt 
                    från sångarting, luciatåg, personalfester till gästspel i kyrkor. Vi har även gjort en direktsänd radiokonsert i P4.</p>
                <p>Varje vår avslutar vi med en stor konsert i varierande tema, ofta tillsammans 
                    med inhyrd solist, grupp eller musiker. Vi har bl a gjort konserter med Norrköpingsbandet 
                    Liverpool för att tillsammans med dem frossa i Beatlessånger och vi har sjungit 
                    Vivaldis Gloria med stråkensemble.</p>
                <p><strong>Vill du vara med?</strong> Just nu tar vi inte in nya medlemmar, 
                    men kontakta vår körledare <a href="mailto:anna@wikblom.se">Anna Wikblom</a> om du vill anmäla ditt intresse eller har andra frågor.</p>
                <p>Vill du boka oss finns mer information på vår <Link className={classes.navLink} to="/kontakt">Kontaktsida</Link></p>
                <Paper className={classes.img}>
                    <img alt="Voxette" src="/images/IMG_3373.jpg" height="300px" />
                </Paper>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Home);