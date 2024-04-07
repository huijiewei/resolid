import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { Size } from "../../utils/types";
import type { BaseProps } from "../slot/Slot";
import { selectSizeStyles } from "./Select.styles";
import { SelectChevron } from "./SelectChevron";

export type NativeSelectProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: Size;

  /**
   * 是否无效
   * @default false
   */
  invalid?: boolean;
};

export const NativeSelect = forwardRef<HTMLSelectElement, BaseProps<"select", NativeSelectProps>>((props, ref) => {
  const { size = "md", disabled = false, invalid = false, children, className, ...rest } = props;

  const sizeStyle = selectSizeStyles[size];

  return (
    <div className={clsx("relative", sizeStyle.text)}>
      <select
        disabled={disabled}
        className={clsx(
          "bg-bg-normal focus:border-bg-primary-emphasis focus:ring-bg-primary-emphasis w-full appearance-none rounded border outline-none transition-colors focus:ring-1",
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
