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

    renderDefaultIcon() {
        return (
            <svg x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" width="25px">
                <g>
                    <path d="M37.5115013,36.2032013c-0.2187004,0.5077972,0.014698,1.0956993,0.5214996,1.3143997l7.5644989,3.2626991   l-7.5478897,3.1025009c-0.5107117,0.2099991-0.7549095,0.7939987-0.5449104,1.3046989   c0.1591988,0.3867989,0.5321999,0.6202011,0.9248009,0.6202011c0.1268997,0,0.2558975-0.0245018,0.3798981-0.0752029   l9.7441025-4.0048981c0.3721123-0.152401,0.6161995-0.5136986,0.6201096-0.9160004   c0.0038872-0.402401-0.2343102-0.767601-0.6035118-0.9267998l-9.7440987-4.2030983   C38.3171997,35.4628983,37.7303009,35.6953011,37.5115013,36.2032013z"/>
                    <path d="M26.4890995,36.2032013c-0.2187996-0.5079002-0.8066998-0.7392998-1.3144875-0.5214996L15.4295006,39.8848   c-0.3691006,0.1591988-0.6073999,0.5243988-0.6035004,0.9267998c0.0039005,0.4023018,0.2480001,0.7635994,0.6201,0.9160004   l9.7451,4.0048981c0.1240005,0.0507011,0.2528992,0.0752029,0.3799,0.0752029c0.3925991,0,0.7665997-0.2334023,0.924799-0.6202011   c0.210001-0.5107002-0.0341988-1.0946999-0.544899-1.3046989l-7.5487995-3.1025009l7.5654106-3.2626991   C26.4743996,37.2989006,26.7077999,36.7109985,26.4890995,36.2032013z"/>
                    <path d="M35.7019997,31.5596008c-0.517601-0.1924-1.0937996,0.0674-1.2881012,0.5849991l-6.1552868,16.4160004   c-0.1934109,0.517601,0.068388,1.0937004,0.585001,1.2881012c0.116188,0.0429001,0.2342873,0.0634003,0.3514881,0.0634003   c0.4042988,0,0.7861996-0.2470016,0.9365101-0.6484032l6.1552887-16.4160004   C36.4803009,32.330101,36.2186127,31.7539005,35.7019997,31.5596008z"/>
                    <path d="M56.6478004,15.7945004L41.1186104,0.293C40.9310989,0.1055,40.6618996,0,40.396801,0l-30.3034,0.002   c-1.6489,0-3.0934005,1.3418-3.0934005,2.9912v57.8754997c0,0.8359032,0.421,1.6221008,1.0127006,2.2148018   C8.6045008,63.6744003,9.486001,64,10.3220005,64H53.905899c0.795002,0,1.6012001-0.3095016,2.1637115-0.8720016   C56.6311989,62.5654984,57,61.8184013,57,61.0243988V16.5014992C57,16.2364006,56.8353004,15.9820004,56.6478004,15.7945004z    M40.0834007,2.1155L53.9660988,16H40.0470009C40.1329994,7.6522999,40.1371002,3.8803,40.0834007,2.1155z M55,61.0243988   c0,0.2569008-0.1637993,0.5083008-0.344902,0.6900024C54.4710007,61.8984985,54.1666985,62,53.905899,62H10.3220005   c-0.3022995,0-0.6817999-0.1175995-0.8951998-0.3305016c-0.2139006-0.2143974-0.4267998-0.4986-0.4267998-0.8008003V2.9932001   c0-0.5464001,0.5396109-0.9912,1.0859995-0.9912L38.0429993,2.0002c0.0488014,2.5220001,0.0214996,10.0921001-0.0305977,14.9890995   c-0.002903,0.2670994,0.112999,0.5244007,0.3009987,0.7138996C38.5014,17.8931007,38.7691994,18,39.0363007,18H55V61.0243988z"/>
                </g>
            </svg>
        );
    }

    renderIcon() {
        return this.props.icon || this.renderDefaultIcon();
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
                        {this.renderIcon()}
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