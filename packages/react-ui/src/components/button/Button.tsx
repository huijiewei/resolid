import { __DEV__ } from "@resolid/utils";
import { forwardRef, type CSSProperties, type JSX } from "react";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { toRounded, type Radius } from "../../utils/radius";
import { Slot, type AsChildProps } from "../slot/Slot";
import { buttonStyles } from "./Button.styles";
import { useButtonGroup, type ButtonBaseProps } from "./ButtonGroupContext";
import { ButtonSpinner } from "./ButtonSpinner";

export type ButtonProps = ButtonBaseProps & {
  /**
   * 是否激活
   * @default false
   */
  active?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否全宽度
   * @default false
   */
  block?: boolean;

  /**
   * 是否方形按钮
   * @default false
   */
  square?: boolean;

  /**
   * 按钮圆角
   * @default true
   */
  radius?: Radius;

  /**
   * 是否有内边距
   * @default true
   */
  padded?: boolean;

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean;

  /**
   * 加载文本
   * @default ''
   */
  loadingText?: string;

  /**
   * 加载器
   * @default Spinner
   */
  spinner?: JSX.Element;

  /**
   * 加载器位置
   * @default 'start'
   */
  spinnerPlacement?: "start" | "end";
};

export const Button = forwardRef<HTMLButtonElement, AsChildProps<"button", ButtonProps>>((props, ref) => {
  const group = useButtonGroup();

  const {
    asChild,
    color = group?.color ?? "primary",
    size = group?.size ?? "md",
    variant = group?.variant ?? "solid",
    type,
    disabled = false,
    active = false,
    block = false,
    square = false,
    padded = true,
    radius = true,
    loading = false,
    loadingText,
    spinner,
    spinnerPlacement = "start",
    className,
    style,
    children,
    ...rest
  } = props;

  const Comp = asChild ? Slot : "button";
  const rounded = toRounded(radius);

  return (
    <Comp
      style={{ ...style, "--rounded-var": rounded.value } as CSSProperties}
      className={clsx(
        buttonStyles({ variant, size, color, disabled, loading, square, block, padded }),
        group
          ? group.vertical
            ? "border-y-[0.5px] first:rounded-t first:border-t last:rounded-b last:border-b"
            : "border-x-[0.5px] first:rounded-s first:border-s last:rounded-e last:border-e"
          : rounded.style,
        className,
      )}
      type={type ?? asChild ? undefined : "button"}
      ref={ref}
      disabled={Boolean(disabled) || loading}
      data-active={dataAttr(active)}
      {...rest}
    >
      {loading ? (
        <div
          className={clsx(
            "relative inline-flex items-center justify-center gap-2",
            loadingText && spinnerPlacement == "end" && "flex-row-reverse",
          )}
        >
          <ButtonSpinner label={loadingText} size={size}>
            {spinner}
          </ButtonSpinner>
          {loadingText || <span className={"opacity-0"}>{children}</span>}
        </div>
      ) : (
        children
      )}
    </Comp>
  );
});

if (__DEV__) {
  Button.displayName = "Button";
}
