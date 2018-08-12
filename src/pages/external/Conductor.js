import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    img: {
        float: 'right',
        marginLeft: theme.spacing.unit
    }
});

class Conductor extends Component {

    render() {

        const { classes } = this.props;

        return (
            <div>
                <h1>Anna Wikblom</h1>
                <div className={classes.img}>
                	<img alt="Anna Wikblom" src="/images/anna2.jpg" height="150px"/>		
                </div>
                <p>Anna Wikblom är utbildad i sång och kördirigering vid Musikhögskolan i
                    Örebro, där hon studerat för Solvieg Ågren och barocksångerskan
                    Susanne Rydén (Stockholm). I den musikpedagogiska kappsäcken har hon
                    flera års sång- och körlärarskap på musikskolan och det estetiska
                    programmet i Köping. Utöver det lustfyllda uppdraget som körledare för
                    damkören Voxette frilansjobbar Anna även som sångerska och körpedagog.
                    Som körsopran sjunger hon i Mats Bertilssons vokalensemble Olaus Petri
                    Vocalis sedan flera år tillbaka, och har under Solvieg Ågren tidigare
                    även sjungit i kammarkören Stella.
                    Annas repertoar är rik och består av allt från äldre till nyskriven
                    musik, där huvudintresset dock är interpretation av barocksång, den
                    tyska Liederrepertoaren, nordisk nationalromantisk sånglyrik samt
                    nutida musik. Som barocksångerska har hon nått framgång hos både
                    kritiker och publik såväl i Sverige som utomlands för sin ljusa
                    koloratur.</p>

                <p>Anna privat är smålandstjejen som hittat tillbaka till födelsestaden
                    Örebro. Hon lever med man (Mikael) och tre ljuvliga råttungar till
                    barn (Mira, Elia och Jonatan) i ett rosa hus som hon gärna snickrar
                    på. Gillar vardagslyx, att läsa, ensammil samt att vara med familjen.
                    Egentid har de senaste åren emellertid mest spenderats åt tjocka böcker, då livet
                    gjort en 180-graderssväng med läkarstudier. Sedan 2017 jobbar 
                    Anna som läkare på Universitetssjukhuset Örebro.</p>            
            </div>
        );
    }
}

Conductor.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Conductor);