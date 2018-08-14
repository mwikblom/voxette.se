import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
});

class GDPR extends Component {

    render() {

        return (
            <div>
                <h1>GDPR</h1>
                <p>
                    Uppgifterna kommer endast användas som kontaktinformation för Voxette och dess medlemmar. Informationen kommer aldrig 
                    säljas eller skickas vidare till tredje part. Endast de uppgifter som behövs för att kontakta medlemmarna samlas in.
                    Var och en i kören ansvarar för att uppgifterna är korrekta och relevanta. Uppgifterna kommer tas bort så snart en 
                    medlem ej längre är aktiv såvida personen själv inte önskar ta del av utskick.
                </p>
            </div>
        );
    }
}

GDPR.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(GDPR);