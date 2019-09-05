import React, { Component } from 'react';
import FirebaseApp from '../../FirebaseApp';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';

class DownloadFile extends Component {
    state = {
        fileUrl: undefined,
        error: undefined
    }
    componentWillMount() {
        const { fullPath } = this.props;
        if (fullPath) {
            FirebaseApp.voxette.getDownloadUrl(fullPath, (url) => {
                if (url) {
                    this.setState({ fileUrl: url });
                } else {
                    this.setState({ error: true });
                }
            });
        } else {
            this.setState({ error: true });
        }
    }

    render() {
        const { fileUrl, error } = this.state;
        if (error) {
            return (
                <div>
                    <p>
                        Det gick inte att öppna filen.
                        <Link to="/inloggad/filer"/>
                    </p>
                </div>
            );
        }
        if (fileUrl) {
            window.location.href = fileUrl;
            return (<div></div>);
        }
        return (<p>Laddar...</p>);
    }
}

DownloadFile.propTypes = {
    fullPath: PropTypes.string,
};
export default DownloadFile;