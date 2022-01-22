import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Editor from "react-simple-code-editor";
import { useField } from "@unform/core";

import { highlight, languages } from "prismjs";

import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-dark.css";

const CodeEditor = forwardRef((props, ref) => {
  const [code, setCode] = useState("");
  const editorRef = useRef(null);

  const { defaultValue, fieldName, registerField, error } = useField(
    props.name
  );

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Editor");
    },
    focus() {
      editorRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: editorRef.current,
      path: "_input.value",
      setValue(_, value) {
        setCode(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <div ref={ref}>
      <Editor
        className="editor"
        textareaId={fieldName}
        value={code}
        defaultValue={defaultValue}
        onValueChange={setCode}
        highlight={(code) => highlight(code, languages.markup, "markup")}
        padding={15}
        ref={editorRef}
        autoFocus={true}
      />
    </div>
  );
});
CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
