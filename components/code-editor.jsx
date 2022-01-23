import React from 'react';
import dynamic from "next/dynamic";
import {FiCopy} from 'react-icons/fi';
import {FaTimes} from 'react-icons/fa';
import {MdOutlineContentPaste} from 'react-icons/md';
import MessageBox from '../components/message-box';

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

class CodeEditor extends React.Component{
    constructor(props) {
        super(props);
        this.msgBox = React.createRef();
        this.editorDidMount = this.editorDidMount.bind(this);
        this.onCopyButtonClick = this.onCopyButtonClick.bind(this);
        this.onPasteButtonClick = this.onPasteButtonClick.bind(this);
        this.onClearButtonClick = this.onClearButtonClick.bind(this);
        this.showMessageBox = this.showMessageBox.bind(this);
      }
    componentDidMount() {
        
    }
    editorDidMount(editor, monaco) {
        //console.log('editorDidMount', editor);
        this.setState({editor: editor});
        if (this.props.focus) editor.focus();
        window.MonacoEnvironment.getWorkerUrl = (
            _moduleId,
            label
            ) => {
            if (label === "json")
                return "_next/static/json.worker.js";
            if (label === "css")
                return "_next/static/css.worker.js";
            if (label === "html")
                return "_next/static/html.worker.js";
            if (
                label === "typescript" ||
                label === "javascript"
            )
                return "_next/static/ts.worker.js";
            return "_next/static/editor.worker.js";
            };
      }
    onCopyButtonClick(e) {
        const editor = this.state.editor;
        // console.log(editor);
        const model = editor.getModel();
        // select all text
        // const range = editor.getModel().getFullModelRange();
        // editor.setSelection(range);
        const value = model.getValue();
        navigator.clipboard.writeText(value);
        this.showMessageBox("Copied!");
    }
    onPasteButtonClick() {
        const editor = this.state.editor;
        const model = editor.getModel();
        // this is promise
        navigator.clipboard.readText().then(clipText => {
            model.setValue(clipText);
        });
    }
    onClearButtonClick() {
        const editor = this.state.editor;
        const model = editor.getModel();
        const range = model.getFullModelRange();
        editor.executeEdits('', [{ range: range, text: null }]);
    }
    showMessageBox(message) {
        this.msgBox.current.show(message);
    }
    render() {
        return (
            <div className="editor__container">
                <div className="float__button__container">
                    {this.props.buttons.includes("copy") && <button className="float__button" title="Copy" onClick={this.onCopyButtonClick}>
                        <FiCopy></FiCopy>
                    </button>}
                    {this.props.buttons.includes("paste") && <button className="float__button" title="Paste" onClick={this.onPasteButtonClick}>
                        <MdOutlineContentPaste></MdOutlineContentPaste>
                    </button>}
                    {this.props.buttons.includes("clear") && <button className="float__button" title="Clear" onClick={this.onClearButtonClick}>
                        <FaTimes></FaTimes>
                    </button>}
                </div>
                <MessageBox ref={this.msgBox} type="success"></MessageBox>
                <MonacoEditor ref={(c) => { this.monaco = c; }}
                editorDidMount={this.editorDidMount}
                width="100%"
                height="100%"
                language={this.props.language}
                theme="vs-dark"
                value={this.props.value}
                options={{
                    minimap: {
                    enabled: false
                    },
                    automaticLayout: true
                }}
                onChange={(e) => this.props.onChange(e)}
                />
            </div>
        )
    }
}
CodeEditor.displayName = "CodeEditor";
CodeEditor.defaultProps = {
    onChange: () => {},
    value: "",
    buttons: [],
    language: "vb"
};
export default CodeEditor;