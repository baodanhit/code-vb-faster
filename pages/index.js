import Head from "next/head";
import Image from "next/image";
import Select from "react-select";
import { useState, useEffect, useMemo, useRef } from "react";
import CodeEditor from "../components/code-editor";

export default function Home() {
  const inputEditorRef = useRef(null);
  const outputEditorRef = useRef(null);
  const startButtonRef = useRef(null);
  const options = [
    // { value: 0, label: "Public" },
    // { value: 1, label: "Protected" },
    { value: 2, label: "Private" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [inputValue, setInputValue] = useState("");
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

  const textProcessor = (inputString) => {
    if (!inputString) return "";

    // let classWrapper = getWrapper(inputString);
    // //console.log(classWrapper);
    // if (!classWrapper) {
    //   return processedText;
    // }

    // let inputStringNoBreak = inputString
    //   .replace(/\r?\n|\r/g, "")
    //   .replace(/\s+/g, " ");

    let classComponents = extractClass(inputString);
    console.log(classComponents);
    if (!classComponents) {
      return "";
    }

    const processedText = generateOutputText(classComponents);

    setOutputValue(processedText);
  };

  const getClassName = (inputString) => {
    const reg = new RegExp(
      /(?<=\Class).+?(?=(\Public|\Private|\Protected))/,
      "gi"
    );
    const matchedValues = inputString.match(reg);
    if (matchedValues) {
      return matchedValues[0].trim();
    }
    return "";
  };

  const getWrapper = (inputString) => {
    const reg = new RegExp(/^(.*)$/, "m");
    const matchedValues = inputString.match(reg);
    if (matchedValues) {
      return matchedValues[0].trim();
    }
    return "";
  };

  const extractClass = (inputString) => {
    let lines = inputString.match(/[^\r\n]+/g);
    if (!lines) return null;

    let wrapper = [];
    let properties = [];

    wrapper.push(lines.shift().trim());
    wrapper.push(lines.pop().trim());

    lines.forEach((line) => {
      const property = getProperty(line);
      if (property) {
        properties.push(property);
      }
    });

    return {
      wrapper,
      properties,
    };
  };

  const getProperty = (inputString) => {
    const reg = new RegExp(/(?<=\Property).+?(?=\As)/, "i");
    const reg2 = new RegExp(/\b(\w+)\W*$/);
    const matchedPropName = inputString.match(reg);
    const matchedPropType = inputString.match(reg2);
    if (matchedPropName && matchedPropType) {
      return {
        name: matchedPropName[0].trim(),
        type: matchedPropType[0].trim(),
      };
    }
    return null;
  };

  const generateOutputText = ({ wrapper, properties }) => {
    let outputText = "";
    outputText += wrapper[0] + "\n";
    let privateProps = "";
    let propertiesGetSet = "";
    let privateTemplate = ({ privateName, type }) => {
      return `\tPrivate ${privateName} As ${type}\n`;
    };
    let propertiesGetSetTemplate = ({ name, type, privateName }) => {
      return (
        `\tPublic Property ${name}() As ${type}\n` +
        "\tGet\n" +
        `\t\tReturn ${privateName}\n` +
        "\tEnd Get\n" +
        `\tSet(ByVal Value As ${type})\n` +
        `\t\t${privateName} = Value\n` +
        "\tEnd Set\n"
      );
    };
    properties.forEach((prop) => {
      prop.privateName =
        "_" + prop.name.charAt(0).toLowerCase() + prop.name.slice(1);
      privateProps += privateTemplate(prop);
      propertiesGetSet += propertiesGetSetTemplate(prop);
    });
    outputText += privateProps;
    outputText += propertiesGetSet;
    outputText += wrapper[1];
    return outputText;
  };

  const onStartButtonClick = (e) => {
    textProcessor(inputValue);
  };

  // useEffect(() => {
  //   console.log(inputValue);
  // }, [inputValue]);

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
            <button
              className="button"
              ref={startButtonRef}
              onClick={onStartButtonClick}
            >
              Do it now!
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
                ref={inputEditorRef}
                onChange={setInputValue}
              ></CodeEditor>
            </div>
          </div>
          <div className="workspace__right">
            <div className="workspace__editor">
              <CodeEditor
                value={outputValue}
                ref={outputEditorRef}
                onChange={setOutputValue}
              ></CodeEditor>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
