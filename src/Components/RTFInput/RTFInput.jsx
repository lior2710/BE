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

        var editorContent, text, html;
        var startsWith = (str, prefix) => str.indexOf(prefix) === 0;
        var endsWith = (str, suffix) => str.match(suffix + '$') === suffix;
        var htmlToFixedText = (htmlStr) => {
            var textStr = htmlToText.fromString(htmlStr, {preserveNewlines: true});
                textStr = this.replaceAll(textStr, '\n\n', '\n');
                textStr = this.replaceAll(textStr, '\n', '...');

            return textStr;
        };

        if (typeof value === 'string') {
            if (startsWith(value, '<') && endsWith(value, '>')) {
                html = value;
                text = htmlToFixedText(html);
            }else{
                html = '<p>' + value + '</p>';
                text = value;
            }
            if (!endsWith(value, ' ')) {
                editorContent = this.getEditorStateFromHTML(value);
            }
        }else{
            html = this.getHTMLFromEditorState(value);
            text = htmlToFixedText(html);
            editorContent = value;
        }

        if (editorContent) {
            this.setState({inputValue: text, editorContents: [editorContent]});
            (this.props.onChange || (() => {}))(html);
        }else{
            this.setState({inputValue: text});
        }
    }

    componentDidMount() {
        window.addEventListener('click', this._onWindowClickHandler);
        this.setValue(this.props.value || '');
    }

    componentWillUnmount() {
        window.removeEventListener('click', this._onWindowClickHandler);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setValue(nextProps.value || '');
        }
    }

    render() {
        const { editorContents } = this.state;
        var html;
        var dirAttr = document.querySelector('html').attributes.dir;
        var isRtl = dirAttr && dirAttr.value === 'rtl';

        if (editorContents[0]) {
            html = this.getHTMLFromEditorState(editorContents[0]);
        }

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
                        onFocus={(e) => (this.props.onFocus || (() => {}))(e, html, this)}
                        onBlur ={(e) => (this.props.onBlur  || (() => {}))(e, html, this)}
                        title={htmlToText.fromString(html, {preserveNewlines: true})}
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
                        onFocus={(e) => (this.props.onFocus || (() => {}))(e, html, this)}
                        onBlur ={(e) => (this.props.onBlur  || (() => {}))(e, html, this)}
                        textAlignment={isRtl ? 'right' : 'left'}
                    />
                </div>
            </div>
        );
    }
}