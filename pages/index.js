import Head from "next/head";
import Select from "react-select";
import { useState, useEffect, useRef } from "react";
import CodeEditor from "../components/code-editor";
import { FcFlashOn } from "react-icons/fc";
import jsonToVb from "../functions/json-to-vb";
import vbToVb from "../functions/vb-to-vb";

export default function Home() {
  const startButtonRef = useRef(null);
  const inputLanguages = [
    { value: "vb", label: "VB" },
    // { value: "json", label: "JSON" },
  ];
  const options = [
    // { value: 0, label: "Public" },
    // { value: 1, label: "Protected" },
    { value: 2, label: "Private" },
  ];
  const defaultValues = {
    input: {
      vb:
        "Public Class User\n" +
        "\tPublic Property Name As String\n" +
        "\tPublic Property Email As String\n" +
        "End Class",
      json: '{\n\t"name":"User",\n\t"props":[\n\t\t{\n\t\t\t"name":"Name",\n\t\t\t"type":"String"\n\t\t},\n\t\t{\n\t\t\t"name":"Email",\n\t\t\t"type":"String"\n\t\t}\n\t]\n}',
    },
  };

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [inputLanguage, setInputLanguage] = useState(inputLanguages[0]);
  const [inputValue, setInputValue] = useState(
    defaultValues.input[inputLanguage.value]
  );
  const [outputValue, setOutputValue] = useState("");

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "#e5f8fc" : null,
        color: "#4b9eb0",
        fontWeight: "bold",
      };
    },
  };

  useEffect(() => {
    setInputValue(defaultValues.input[inputLanguage.value]);
  }, [inputLanguage]);

  const onStartButtonClick = (e) => {
    let outputCode = "";
    if (inputLanguage.value === "vb") {
      outputCode = vbToVb(inputValue);
    } else {
      outputCode = jsonToVb(inputValue);
    }
    if (outputCode) {
      setOutputValue(outputCode);
    } else {
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Code VB.NET Faster</title>
        <meta name="description" content="VB.NET class modifier" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">VB.NET Class Modifier</h1>
        <div className="workspace__header">
          <div className="workspace__header__left">
            <Select
              options={inputLanguages}
              styles={colourStyles}
              className="select-left"
              isClearable={false}
              isSearchable={false}
              defaultValue={inputLanguage}
              onChange={(option) => setInputLanguage(option)}
            />
            <button
              className="button"
              ref={startButtonRef}
              onClick={onStartButtonClick}
            >
              Do it now!
              <FcFlashOn></FcFlashOn>
            </button>
          </div>
          <div className="workspace__header__right">
            <div className="select__label">Change properties to: </div>
            <Select
              options={options}
              styles={colourStyles}
              className="select"
              isClearable={false}
              isSearchable={false}
              defaultValue={selectedOption}
              onChange={(option) => setSelectedOption(option)}
            />
          </div>
        </div>
        <div className="workspace">
          <div className="workspace__left">
            <div className="workspace__editor">
              <CodeEditor
                value={inputValue}
                buttons={["paste", "clear"]}
                language={inputLanguage.value}
                onChange={setInputValue}
              ></CodeEditor>
            </div>
          </div>
          <div className="workspace__right">
            <div className="workspace__editor">
              <CodeEditor
                value={outputValue}
                buttons={["copy", "clear"]}
                language="vb"
                onChange={setOutputValue}
              ></CodeEditor>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
