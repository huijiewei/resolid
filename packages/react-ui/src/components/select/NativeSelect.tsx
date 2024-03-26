import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { Size } from "../../utils/types";
import type { BaseProps } from "../slot/Slot";
import { SelectChevron } from "./SelectChevron";

export type NativeSelectProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: Size;
};

const selectSizeStyles = {
  xs: {
    text: "text-xs",
    select: "py-[5px] pl-2.5 pr-7",
    chevron: "px-2",
  },
  sm: {
    text: "text-sm",
    select: "py-[5px] pl-3 pr-8",
    chevron: "px-2",
  },
  md: {
    text: "text-base",
    select: "py-[5px] pl-3.5 pr-8",
    chevron: "px-2",
  },
  lg: {
    text: "text-base",
    select: "py-[7px] pl-4 pr-10",
    chevron: "px-2.5",
  },
  xl: {
    text: "text-lg",
    select: "py-[7px] pl-5 pr-12",
    chevron: "px-3",
  },
};

export const NativeSelect = forwardRef<HTMLSelectElement, BaseProps<"select", NativeSelectProps>>((props, ref) => {
  const { size = "md", disabled, children, className, ...rest } = props;

  const sizeStyle = selectSizeStyles[size];

  return (
    <div className={clsx("relative", sizeStyle.text)}>
      <select
        disabled={disabled}
        className={clsx(
          "w-full appearance-none rounded border border-bg-muted bg-bg-normal outline-none transition-colors focus:border-bg-primary-emphasis focus:ring-1 focus:ring-bg-primary-emphasis",
          sizeStyle.select,
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </select>
      <span
        className={clsx(
          "pointer-events-none absolute bottom-0 right-0 top-0 flex items-center justify-center",
          sizeStyle.chevron,
        )}
      >
        <SelectChevron />
      </span>
    </div>
  );
});

if (__DEV__) {
  NativeSelect.displayName = "NativeSelect";
}
