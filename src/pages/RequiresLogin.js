import React, { Component } from 'react';

export default class RequiresLogin extends Component {
  render() {
    return (
      <div>
        <h1>Logga in</h1>
        <p>
          Sidan du försökt navigera till kräver inloggning. Logga in på ditt
          konto via knappen i menyn.
        </p>
      </div>
    );
  }
}
