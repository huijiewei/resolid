import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { inputSizeStyles } from "./Input.styles";
import { useInputGroup } from "./InputGroupContext";

export const InputAddon = (props: BaseProps<"span">) => {
  const { className, children, ...rest } = props;

  const group = useInputGroup();

  if (group == undefined) {
    throw new Error(`useInputGroup returned \`undefined\`. Seems you forgot to wrap component within InputGroup`);
  }

  return (
    <span
      className={clsx(
        "text-fg-muted bg-bg-subtlest flex items-center rounded border",
        "first:rounded-br-none first:rounded-tr-none last:rounded-bl-none last:rounded-tl-none [&:not(:first-child)]:-ms-px [&:not(:first-child,:last-child)]:rounded-none",
        inputSizeStyles[group.size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

if (__DEV__) {
  InputAddon.displayName = "InputAddon";
}
