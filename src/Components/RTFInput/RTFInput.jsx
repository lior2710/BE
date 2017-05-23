import React            from 'react';
import {Editor}         from 'react-draft-wysiwyg';
import {EditorState}    from 'draft-js';
import {convertToRaw}   from 'draft-js';
import {stateFromHTML}  from 'draft-js-import-html';
import draftToHtml      from 'draftjs-to-html';
import htmlToText       from 'html-to-text';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RTFInput.scss';

export default class RTFInput extends React.Component {
    static get toolbarDef() {
        return {
            options: ['inline', 'blockType', 'list', 'textAlign'],
            inline: {
                inDropdown: true,
                options: ['bold', 'italic', 'underline']
            },
            fontSize: {
                options: [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96],
                className: undefined,
                dropdownClassName: undefined
            },
            fontFamily: {
                options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                className: undefined,
                dropdownClassName: undefined
            },
            list: {
                inDropdown: true,
                className: undefined,
                options: ['unordered', 'ordered', 'indent', 'outdent']
            },
            textAlign: {
                inDropdown: true,
                className: undefined,
                options: ['left', 'center', 'right', 'justify']
            }
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            showDropdown: false,
            inputValue: '',
            editorContents: []
        };

        this._onWindowClickHandler = this.onWindowClick.bind(this);
    }
    hideRTFDropdown() {
        this.setState({showDropdown: false});
    }

    getEditorStateFromHTML(html) {
        return EditorState.createWithContent(stateFromHTML(html));
    }

    getHTMLFromEditorState(editorState) {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }

    onEditorStateChange(editorContent) {
        let editorContents = this.state.editorContents;

        editorContents[0] = editorContent;
        editorContents = [...editorContents];

        this.setState({editorContents});


        // var html = this.getHTMLFromEditorState(editorContents[0]);

        this.setValue(editorContents[0]);
    };

    onWindowClick(e) {
        if (this._boxClick) {
            delete this._boxClick;
            return;
        }

        this.hideRTFDropdown();
    }

    onTextInputChange(e) {
        this.setValue(e.target.value);
    }

    fixValue(value) {
        if (value.indexOf('<p>') != -1) return;

        return '<p>' + this.replaceAll(value, '\n', '<br>') + '</p>'
    }

    replaceAll(string, find, replace) {
        return string.replace(new RegExp(find, 'g'), replace);
    }

    setValue(value) {
        // value = this.fixValue(value);

        var html, editorContent;

        if (typeof value === 'string') {
            html = value;
            editorContent = this.getEditorStateFromHTML(value);
        }else{
            html = this.getHTMLFromEditorState(value);
            editorContent = value;
        }

        html = htmlToText.fromString(html, {preserveNewlines: true});
        html = this.replaceAll(html, '\n\n', '\n');
        html = this.replaceAll(html, '\n', '...');

        this.setState({
            inputValue      : html,
            editorContents  : [editorContent]
        });
    }

    componentDidMount() {
        window.addEventListener('click', this._onWindowClickHandler);
        this.setValue(this.props.value || '');
    }

    componentWillUnmount() {
        window.removeEventListener('click', this._onWindowClickHandler);
    }

    render() {
        const { editorContents } = this.state;

        return (
            <div
                className={['rtf-input', this.props.className].join(' ')}
                onClick={() => this._boxClick = true}
                style={this.props.style}
            >
                <div className="input-group rtf-input-group">
                    <input
                        type="text"
                        className="form-control rtf-input-text-input"
                        placeholder="Type here"
                        value={this.state.inputValue}
                        onChange={(e) => this.onTextInputChange(e)}
                    />
                    <span
                        className="input-group-addon rtf-input-group-addon"
                        onClick={() => this.setState({showDropdown: !this.state.showDropdown})}
                    >
                        @
                    </span>
                </div>
                <div className="rtf-input-editor" hidden={!this.state.showDropdown}>
                    <Editor
                        toolbar={RTFInput.toolbarDef}
                        editorState={editorContents[0]}
                        onEditorStateChange={(content) => this.onEditorStateChange(content)}
                    />
                </div>
            </div>
        );
    }
}