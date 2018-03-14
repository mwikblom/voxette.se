import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';

class EditableContent extends Component {

    constructor(props) {
        super(props);
		
        this.state = {
            dataKey: props.dataKey,
            edit: false
        };
    }
    

    render() {
        return this.state.edit ? 
            <form > <Editor
                initialValue="<p>This is the initial content of the editor</p>"
                init={{
                    plugins: 'link image code save',
                    toolbar: 'save | undo redo | bold italic | alignleft aligncenter alignright | code',
                    save_onsavecallback: () => this.saveContent()
                }}				
            	/>
            </form> : <button type="button" onClick={() => this.switchMode()}>Click to edit page!</button>
        ;
    }

    switchMode() {
        this.setState((prevState) => {
            return {
                edit: !prevState.edit
            };
        });
    }
	
    saveContent() {
        //e.preventDefault();
        console.log('TODO save to DB:');
        this.switchMode();
    }

}

EditableContent.propTypes = {
    dataKey: PropTypes.string.isRequired
};

export default EditableContent;