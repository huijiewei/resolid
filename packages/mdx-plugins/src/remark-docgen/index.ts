import { fromJs } from "esast-util-from-js";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";
import { cwd } from "node:process";
import { withCustomConfig, type PropItem } from "react-docgen-typescript";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type RemarkDocgenOptions = {
  sourceRoot: string;
};

export type ComponentProp = {
  name: string;
  type: string;
  control: string;
  typeValues: null | string[];
  description: string;
  defaultValue?: string;
  required: boolean;
};

const propsTables: Record<string, ComponentProp[]> = {};

export const remarkDocgen: Plugin<[RemarkDocgenOptions]> = ({ sourceRoot }) => {
  if (!sourceRoot) {
    throw new Error(`Please set sourceRoot.`);
  }

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

const componentPropsCachePath = join(cwd(), ".resolid", "component-props-cache");

mkdirSync(componentPropsCachePath, { recursive: true });

const getComponentProps = (componentFile: string, componentName: string): ComponentProp[] | null => {
  const componentPropsFile = join(componentPropsCachePath, `${componentName}.json`);

  if (existsSync(componentPropsFile) && statSync(componentPropsFile).mtimeMs > statSync(componentFile).mtimeMs) {
    return JSON.parse(readFileSync(componentPropsFile, "utf8"));
  } else {
    const componentDoc = tsParser.parse(componentFile).find((c) => c.displayName == componentName);

    const props = componentDoc
      ? Object.entries(componentDoc.props).map(([key, value]) => {
          const type: { type: string; control: string; typeValues: null | string[] } = {
            type: value.type.name,
            control: value.type.name,
            typeValues: null,
          };

          if (value.type.name == "enum") {
            if (!value.type.raw) {
              type.type = value.type.name;
            } else if (
              value.type.raw.includes(" | ") ||
              ["string", "number", "boolean", "ReactNode"].includes(value.type.raw)
            ) {
              type.type = value.type.raw;
              type.control = value.type.raw;

              if (value.type.raw.includes(" | ")) {
                type.control = "select";
                type.typeValues = value.type.value
                  .map((item: { value: string }) => item.value)
                  .filter((v: string) => v != "number" && v != "string");
              }
            } else {
              const typeValues = value.type.value.map((item: { value: string }) => item.value);
              type.type = typeValues.join(" | ");
              type.control = "select";
              type.typeValues = typeValues.filter((v: string) => v != "number" && v != "string");
            }
          }

          if (!value.required) {
            type.type = type.type.replace(" | undefined", "");
          }

          if (type.type.startsWith("NonNullable<")) {
            type.type = type.type.slice(12, -1).replace(" | null", "").replace(" | undefined", "");
          }

          type.type = type.type.replace("React.", "").replace(/ReactElement<.*>/g, "ReactElement");

          return {
            name: key,
            ...type,
            required: value.required,
            description: value.description,
            defaultValue: value.defaultValue?.value ?? "",
          };
        })
      : null;

    writeFileSync(componentPropsFile, JSON.stringify(props), "utf8");

    return props;
  }
};
