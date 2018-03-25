import React, { Component } from 'react';

export default class Members extends Component {
	constructor(props) {
		super(props);
	}
    render() {
        return (
            <div>
				<h2>Medlemmar</h2>
                <p>Visar inloggade medlemmens uppgifter samt listar alla medlemmar i kören.</p>
            </div>
        );
    }
}