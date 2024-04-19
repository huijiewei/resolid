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

const reactNodeToString = function (reactNode: ReactNode): string {
  let string = "";

  if (isString(reactNode)) {
    string = reactNode;
  } else if (isNumber(reactNode)) {
    string = reactNode.toString();
  } else if (Array.isArray(reactNode)) {
    reactNode.forEach(function (child) {
      string += reactNodeToString(child);
    });
  } else if (isValidElement(reactNode)) {
    string += reactNodeToString(reactNode.props.children);
  }

  return string;
};
