import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { focusInputStyles, sharedInputTextStyles } from "../../shared/styles";
import { clsx } from "../../utils/classed";
import type { Size } from "../../utils/types";
import type { BaseProps } from "../slot/slot";
import { SelectChevron } from "./select-chevron";
import { selectSizeStyles } from "./select.styles";

export type NativeSelectProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: Size;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否无效
   * @default false
   */
  invalid?: boolean;
};

export const NativeSelect = forwardRef<HTMLSelectElement, BaseProps<"select", NativeSelectProps>>((props, ref) => {
  const { size = "md", disabled = false, invalid = false, children, className, ...rest } = props;

  const sizeStyle = selectSizeStyles[size];
  const textStyle = sharedInputTextStyles[size];

  return (
    <div className={clsx("relative", textStyle)}>
      <select
        disabled={disabled}
        className={clsx(
          "w-full appearance-none rounded border bg-bg-normal outline-none transition-colors",
          focusInputStyles,
          invalid && "border-bd-invalid",
          !invalid && !disabled && "hover:border-bd-hovered",
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
