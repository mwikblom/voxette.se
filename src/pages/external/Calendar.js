import React, { Component } from 'react';
import EditableContent from '../../components/EditableContent';

export default class Calendar extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}
    render() {
        return (
            <div>
                <EditableContent dataKey="contact"/>
                <h2>Kalender</h2>
                <p>Här kan du höra oss</p>
            </div>
        );
    }
}