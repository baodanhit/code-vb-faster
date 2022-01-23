export default function vbToVb(text) {
  const textProcessor = (inputString) => {
    if (!inputString) return "";

    let classComponents = extractClass(inputString);
    console.log(classComponents);
    if (!classComponents) {
      return "";
    }

    const processedText = generateOutputText(classComponents);

    return processedText;
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
    let privateProps = [];
    let privatePropsGetSet = [];

    wrapper.push(lines.shift().trim());
    wrapper.push(lines.pop().trim());

    lines.forEach((line, index) => {
      if (isPrivateProperty(line)) {
        privateProps.push(line + "\n");
        return;
      }
      if (isGetSetForPrivate(line, privateProps)) {
        const { lineEndIndex, subValue } = getSubGetSet(lines, index);
        console.log(lineEndIndex, subValue);
        lines.splice(index, lineEndIndex - index);
        privatePropsGetSet.push(subValue);
        return;
      }
      const property = getProperty(line);
      if (property) {
        properties.push(property);
      }
    });

    return {
      wrapper,
      properties,
      privateProps,
      privatePropsGetSet,
    };
  };
  const isPrivateProperty = (inputString) => {
    return inputString.match(/Private/i) ? true : false;
  };
  const isGetSetForPrivate = (inputString, privateArray) => {
    const words = inputString.match(/\S+/g);
    if (!words) return false;
    let name = "";
    if (words.length === 4) {
      name = words[1];
    } else if (words.length === 5) {
      name = words[2];
    }
    if (name.match(/\(/g)) {
      const matchedPropName = privateArray.filter((line) =>
        line.toLowerCase().includes(name.toLocaleLowerCase())
      );
      if (matchedPropName) return true;
    }
    return false;
  };
  const getSubGetSet = (linesArray, index) => {
    let i = index;
    let lineEndIndex = 0;
    let subValue = "";
    let endSub = false;
    while (!endSub) {
      const line = linesArray[i];
      if (line && line.match(/\End Property/i)) {
        endSub = true;
        lineEndIndex = i;
      }
      subValue += line + "\n";
      i++;
    }
    return { lineEndIndex, subValue };
  };
  const getProperty = (inputString) => {
    const words = inputString.match(/\S+/g);
    let property = null;

    switch (words.length) {
      case 4:
        property = {
          name: words[1].trim(),
          type: words[3].trim(),
          defaultValue: null,
        };
        break;
      case 5:
        property = {
          name: words[2].trim(),
          type: words[4].trim(),
          defaultValue: null,
        };
        break;
      case 6:
        property = {
          name: words[1].trim(),
          type: words[3].trim(),
          defaultValue: words[5].trim(),
        };
        break;
      case 7:
        property = {
          name: words[2].trim(),
          type: words[4].trim(),
          defaultValue: words[6].trim(),
        };
        break;
    }
    return property;
  };

  const generateOutputText = ({
    wrapper,
    properties,
    privateProps,
    privatePropsGetSet,
  }) => {
    let outputText = "";
    outputText += wrapper[0] + "\n";
    let privatePropsCreated = "";
    let propertiesGetSet = "";
    let privateTemplate = ({ privateName, type, defaultValue }) => {
      return `\tPrivate ${privateName} As ${type} ${
        defaultValue ? "= " + defaultValue : ""
      }\n`;
    };
    let propertiesGetSetTemplate = ({ name, type, privateName }) => {
      return (
        `\tPublic Property ${name}() As ${type}\n` +
        "\t\tGet\n" +
        `\t\t\tReturn ${privateName}\n` +
        "\t\tEnd Get\n" +
        `\t\tSet(ByVal Value As ${type})\n` +
        `\t\t\t${privateName} = Value\n` +
        "\t\tEnd Set\n" +
        "\tEnd Property\n"
      );
    };
    properties.forEach((prop) => {
      prop.privateName =
        "_" + prop.name.charAt(0).toLowerCase() + prop.name.slice(1);
      privatePropsCreated += privateTemplate(prop);
      propertiesGetSet += propertiesGetSetTemplate(prop);
    });
    privatePropsCreated += privateProps.join("");
    propertiesGetSet += privatePropsGetSet.join("");
    outputText += privatePropsCreated;
    outputText += propertiesGetSet;
    outputText += wrapper[1];
    return outputText;
  };
  return textProcessor(text);
}
