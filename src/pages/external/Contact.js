import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({});

class Contact extends Component {
  render() {
    return (
      <div>
        <h1>Kontakt</h1>
        <h2>Boka oss</h2>
        <p>
          Vi kommer gärna och sjunger på ert företag när ni ska ha kick-off,
          avtackning, julfest el. dyl. eller på privata tillställningar eller
          föreningsträffar. Hör med oss!
        </p>
        <p>
          Vi har sjungit i alla möjliga sammanhang, t ex på stan mitt i
          vårruset, en timmes direktsänd konsert i Sveriges Radio P4, i kyrkor
          på bröllop och vid andra högtider, vid Luciafirande på företag,
          Valborgsmässofirande, på privata födelsedagskalas, köpcentrum, jag
          till och med på bal på slottet.
        </p>

        <p>
          Kontakta <a href="mailto:kfumvoxette@gmail.com">Voxette</a> för mer information.
        </p>

        <h2>Sociala medier</h2>

        <p>
          <a href="https://www.facebook.com/ChoirVoxette" target="_blank">Voxette på facebook</a>
          <br/>
          <a href="https://www.youtube.com/@kfumvoxette" target="_blank">Voxette på youtube</a>
        </p>
      </div>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Contact);
