import { Button, Tooltip, TooltipArrow, TooltipContent, TooltipTrigger, useClipboard } from "@resolid/react-ui";
import { isNumber, isString } from "@resolid/utils";
import { isValidElement, useMemo, type ReactNode } from "react";
import { SpriteIcon } from "~/components/base/sprite-icon";

export const ClipboardButton = ({ content }: { content: ReactNode }) => {
  const { copied, copy } = useClipboard();

  const code = useMemo(() => {
    return reactNodeToString(content);
  }, [content]);

  return (
    <Tooltip color={copied ? "success" : undefined}>
      <TooltipTrigger asChild>
        <Button
          square={true}
          className={"p-0.5"}
          padded={false}
          color={"neutral"}
          variant={"soft"}
          onClick={() => copy(code)}
        >
          {copied ? (
            <SpriteIcon size={"1rem"} className={"text-fg-success"} name={"clipboard-check"} />
          ) : (
            <SpriteIcon size={"1rem"} className={"text-fg-muted hover:text-link-hovered"} name={"clipboard"} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <TooltipArrow />
        {copied ? "复制成功" : "复制代码"}
      </TooltipContent>
    </Tooltip>
  );
};

// From https://github.com/sunknudsen/react-node-to-string/blob/master/src/index.ts
const reactNodeToString = (reactNode: ReactNode): string => {
  const strings = [];

  if (isString(reactNode)) {
    strings.push(reactNode);
  } else if (isNumber(reactNode)) {
    strings.push(reactNode.toString());
  } else if (Array.isArray(reactNode)) {
    for (const child of reactNode) {
      strings.push(reactNodeToString(child));
    }
  } else if (isValidElement(reactNode)) {
    strings.push(reactNodeToString(reactNode.props.children));
  }

  return strings.join("");
};
