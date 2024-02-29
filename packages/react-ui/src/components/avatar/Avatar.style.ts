import { isNumber } from "@resolid/utils";
import { isDarkColor, randomColor } from "../../utils/color";
import type { Size, Styled } from "../../utils/types";

const avatarSizeStyles = {
  xs: "h-4 w-4 text-[calc(theme(height.4)/2)]",
  sm: "h-7 w-7 text-[calc(theme(height.7)/2)]",
  md: "h-10 w-10 text-[calc(theme(height.10)/3)]",
  lg: "h-14 w-14 text-[calc(theme(height.14)/3)]",
  xl: "h-20 w-20 text-[calc(theme(height.20)/3)]",
};

export const toSized = (size: number | Size): Styled => {
  if (isNumber(size)) {
    return {
      value: `${size}px`,
      style:
        "w-[--size-var] h-[--size-var] " +
        (size > 50 ? "text-[length:calc(var(--size-var)/3)]" : "text-[length:calc(var(--size-var)/2)]"),
    };
  }

  return {
    value: undefined,
    style: avatarSizeStyles[size as Size],
  };
};

export const toColored = (name: string | undefined): Styled => {
  if (name) {
    const bgColor = randomColor(name);
    const textColor = isDarkColor(bgColor) ? "#DCE3E8" : "#2A3F4D";

    return {
      value: `${bgColor},${textColor}`,
      style: "bg-[--color-bg-var] text-[--color-text-var]",
    };
  }

  return {
    value: undefined,
    style: "bg-bg-muted",
  };
};
