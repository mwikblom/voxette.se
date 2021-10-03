import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

class EditableContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataKey: props.dataKey,
      edit: false,
      content: 'Loading...',
      loggedIn: props.loggedIn,
    };

    this.content = 'No content';

    this.saveContent = this.saveContent.bind(this);
  }

  componentWillMount() {
    try {
      firebase
        .database()
        .ref('pages/' + this.props.dataKey)
        .once('value')
        .then((snapshot) => {
          this.setState(() => {
            return {
              content: snapshot.val() ? snapshot.val().content : 'No content',
            };
          });
        });
    } catch (e) {
      console.log('ERROR ' + e);
    }
  }

  render() {
    return this.state.loggedIn ? (
      this.state.edit ? (
        <form>
          {' '}
          <Editor
            initialValue={this.state.content}
            init={{
              plugins: 'link image code save',
              toolbar:
                'save | undo redo | bold italic | alignleft aligncenter alignright | code',
              save_onsavecallback: () => this.saveContent(),
            }}
            onChange={(e) => this.handleEditorChange(e)}
          />
        </form>
      ) : (
        <div>
          <button type="button" onClick={() => this.switchMode()}>
            Click to edit page!
          </button>
          <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
        </div>
      )
    ) : (
      <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
    );
  }

  switchMode() {
    this.setState((prevState) => {
      return {
        edit: !prevState.edit,
      };
    });
  }

  handleEditorChange(e) {
    this.content = e.target.getContent();
  }

  saveContent() {
    firebase
      .database()
      .ref('pages/' + this.props.dataKey)
      .set({
        content: this.content,
      });

    this.setState(() => {
      return {
        content: this.content,
      };
    });

    console.log('Done');

    this.switchMode();
  }
}

EditableContent.propTypes = {
  dataKey: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export default EditableContent;
