import {useState, useEffect, forwardRef} from 'react';
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

const CodeEditor = forwardRef((props, ref) => {
    return (
        <div className="editor__container">
            <MonacoEditor ref={ref}
            editorDidMount={() => {
                // @ts-ignore
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
            }}
            width="100%"
            height="100%"
            language="vb"
            theme="vs-dark"
            value={props.value}
            options={{
                minimap: {
                enabled: false
                },
                automaticLayout: true
            }}
            onChange={(e) => props.onChange(e)}
            />
        </div>
    )
})
CodeEditor.displayName = "CodeEditor";
CodeEditor.defaultProps = {
    onChange: () => {},
    value: ""
};
export default CodeEditor;