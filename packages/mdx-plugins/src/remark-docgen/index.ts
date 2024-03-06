import { fromJs } from "esast-util-from-js";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { join, parse } from "node:path";
import { withCustomConfig, type PropItem } from "react-docgen-typescript";
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

  const propsTables: Record<string, ComponentProp[]> = {};

  return (tree) => {
    visit(tree, "mdxJsxFlowElement", (node) => {
      const elem = node as MdxJsxFlowElement;

      if (elem.name == "ComponentProps" || elem.name == "ComponentUsage") {
        const componentFile = getElementAttrValue(elem, "componentFile");

        if (componentFile == "") {
          throw new Error(`Invalid componentFile prop for ${elem.name}.`);
        }

        const componentName = parse(componentFile).name;

        if (!propsTables[componentName]) {
          const componentProps = getComponentProps(join(sourceRoot, componentFile), componentName);

          if (componentProps) {
            propsTables[componentName] = componentProps;
          }
        }

        if (propsTables[componentName]) {
          const propsJSON = JSON.stringify(propsTables[componentName]);

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

const getElementAttrValue = (elem: MdxJsxFlowElement, attrName: string) => {
  const attr = elem.attributes.find((attr) => "name" in attr && attr["name"] == attrName);

  if (attr) {
    if (typeof attr.value == "string") {
      return attr.value as string;
    }

    return attr.value?.value.slice(1, -1) ?? "";
  }

  return "";
};

const getComponentProps = (componentFile: string, componentName: string): ComponentProp[] | null => {
  const componentDoc = tsParser.parse(componentFile).find((c) => c.displayName == componentName);

  if (componentDoc) {
    return Object.entries(componentDoc.props).map(([key, value]) => {
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
    });
  }

  return null;
};
