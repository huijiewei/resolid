import { fromJs } from "esast-util-from-js";
import fg from "fast-glob";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { parse } from "node:path";
import { withCustomConfig, type ComponentDoc, type PropItem } from "react-docgen-typescript";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type RemarkDocgenOptions = {
  sourceRoot: string;
};

export type ComponentProp = {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  required: boolean;
};

export const remarkDocgen: Plugin<[RemarkDocgenOptions]> = ({ sourceRoot }) => {
  if (!sourceRoot) {
    throw new Error(`Please set sourceRoot.`);
  }

  return (tree, vfile) => {
    const componentName = parse(vfile.path).name;

    const propsTables: Record<string, ComponentProp[]> = {};
    const componentDoc = getComponentDoc(sourceRoot, componentName);

    if (componentDoc) {
      propsTables[componentName] = componentDoc.propsTable;
    }

    visit(tree, "mdxJsxFlowElement", (node) => {
      const elem = node as MdxJsxFlowElement;

      if (elem.name == "ComponentProps" || elem.name == "ComponentUsage") {
        const nodeComponentName = getNodeComponentName(elem);

        if (nodeComponentName == "") {
          throw new Error(`Invalid component prop for ${elem.name}.`);
        }

        if (!propsTables[nodeComponentName]) {
          const nodeComponentDoc = getComponentDoc(sourceRoot, nodeComponentName);

          if (nodeComponentDoc) {
            propsTables[nodeComponentName] = nodeComponentDoc.propsTable;
          }
        }

        if (propsTables[nodeComponentName]) {
          const propsJSON = JSON.stringify(propsTables[nodeComponentName]);

          elem.attributes.push({
            type: "mdxJsxAttribute",
            name: "componentProps",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: `(${propsJSON})`,
              data: {
                estree: fromJs(`(${propsJSON})`, {
                  module: true,
                }),
              },
            },
          } as MdxJsxAttribute);
        }
      }
    });
  };
};

const tsParser = withCustomConfig("tsconfig.json", {
  savePropValueAsString: false,
  skipChildrenPropWithoutDoc: false,
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop: PropItem) => {
    if (["ref", "style", "className"].includes(prop.name)) {
      return false;
    }

    if (prop.description.includes("@ignore")) {
      return false;
    }

    if (prop.declarations && prop.declarations.length > 0) {
      return prop.declarations.find((declaration) => !declaration.fileName.includes("node_modules")) != undefined;
    }

    return true;
  },
});

const getNodeComponentName = (elem: MdxJsxFlowElement) => {
  const attr = elem.attributes.find((attr) => "name" in attr && attr["name"] == "component");

  if (attr) {
    if (typeof attr.value == "string") {
      return attr.value as string;
    }

    return attr.value?.value.slice(1, -1) ?? "";
  }

  return "";
};

const getComponentDoc = (
  sourceRoot: string,
  componentName: string,
): { sourcePath: string; propsTable: ComponentProp[] } | null => {
  const files = fg.globSync(`${sourceRoot}/**/${componentName}.tsx`);

  for (const file of files) {
    const componentDoc = tsParser.parse(file).find((item: ComponentDoc) => {
      return item.displayName == componentName;
    });

    if (componentDoc) {
      return {
        sourcePath: componentDoc.filePath.replace(sourceRoot, ""),
        propsTable: Object.entries(componentDoc.props).map(([key, value]) => {
          let typeText = "";

          if (value.type.name == "enum") {
            if (!value.type.raw) {
              typeText = value.type.name;
            } else if (
              value.type.raw.includes(" | ") ||
              ["string", "number", "boolean", "ReactNode"].includes(value.type.raw)
            ) {
              typeText = value.type.raw;
            } else {
              typeText = value.type.value.map((item: { value: string }) => item.value).join(" | ");
            }
          }

          if (!value.required) {
            typeText = typeText.replace(" | undefined", "");
          }

          if (typeText.startsWith("NonNullable<")) {
            typeText = typeText.slice(12, -1);
            typeText = typeText.replace(" | null", "");
            typeText = typeText.replace(" | undefined", "");
          }

          typeText = typeText.replace("React.", "").replace(/ReactElement<.*>/g, "ReactElement");

          return {
            name: key,
            type: typeText,
            required: value.required,
            description: value.description,
            defaultValue: value.defaultValue?.value ?? "",
          };
        }),
      };
    }
  }

  return null;
};
