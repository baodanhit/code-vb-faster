export default function jsonToVb(json) {
  const jsonProcessor = (inputString) => {
    try {
      const classObject = JSON.parse(inputString);
      if (
        !classObject.hasOwnProperty("name") ||
        (!classObject.hasOwnProperty("props") &&
          !classObject.hasOwnProperty("properties"))
      ) {
        return; //showError();
      }
      let props = [];
      let access = "Public";
      if (classObject.hasOwnProperty("props")) {
        props = classObject.props;
      } else {
        props = classObject.properties;
      }
      if (!Array.isArray(props)) {
        return; //showError();
      }
      if (classObject.hasOwnProperty("access")) {
        access = classObject.access;
      }
      const outputCode = genegrateCodeFromObject({
        name: classObject.name,
        props,
        access,
      });
      if (!outputCode) return; //showError
      //   console.log(
      //     "🚀 ~ file: index.js ~ line 252 ~ jsonProcessor ~ outputCode",
      //     outputCode
      //   );
      return outputCode;
    } catch (e) {
      //   console.log("🚀 ~ file: index.js ~ line 258 ~ jsonProcessor ~ e", e);
      //showError();
      return "";
    }
  };
  const genegrateCodeFromObject = ({ name, props, access }) => {
    let lines = [];
    let privatePropsCreated = [];
    let propertiesGetSet = [];
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

    lines.push(access + " Class " + name + "\n");
    props.forEach((prop) => {
      prop.privateName =
        "_" + prop.name.charAt(0).toLowerCase() + prop.name.slice(1);
      privatePropsCreated += privateTemplate(prop);
      propertiesGetSet += propertiesGetSetTemplate(prop);
    });
    lines.push(privatePropsCreated, propertiesGetSet);
    lines.push("End Class");
    return lines.join("");
  };
  return jsonProcessor(json);
}
