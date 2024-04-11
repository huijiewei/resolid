import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { Color } from "../../utils/types";
import { Slot, type AsChildProps } from "../slot/Slot";
import type { PageType } from "./usePagination";

const paginationItemSelectedColorStyles = {
  neutral: {
    normal: "bg-bg-neutral-emphasis",
    hovered: "hover:bg-bg-neutral-emphasis-hovered",
  },
  primary: {
    normal: "bg-bg-primary-emphasis",
    hovered: "hover:bg-bg-primary-emphasis-hovered",
  },
  success: {
    normal: "bg-bg-success-emphasis",
    hovered: "hover:bg-bg-success-emphasis-hovered",
  },
  warning: {
    normal: "bg-bg-warning-emphasis",
    hovered: "hover:bg-bg-warning-emphasis-hovered",
  },
  danger: {
    normal: "bg-bg-danger-emphasis",
    hovered: "hover:bg-bg-danger-emphasis-hovered",
  },
};

export type PaginationItemProps = {
  color: Color;
  disabled: boolean;
  page: number;
  pageType: PageType;
  pageState: number;
  setPageState: (page: number) => void;
};

export const PaginationItem = forwardRef<HTMLButtonElement, AsChildProps<"button", PaginationItemProps, "type">>(
  (props, ref) => {
    const {
      asChild = false,
      children,
      className,
      color,
      disabled,
      page,
      pageType,
      pageState,
      setPageState,
      ...rest
    } = props;

    const title = pageType == "previous" ? "上一页" : pageType == "next" ? "下一页" : `第 ${page} 页`;

    const selected = pageType == "page" && page == pageState;
    const selectedStyle = paginationItemSelectedColorStyles[color];

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        title={title}
        disabled={disabled}
        aria-current={selected ? "page" : undefined}
        className={clsx(
          "inline-flex h-8 min-w-8 select-none appearance-none items-center justify-center rounded px-2 disabled:cursor-not-allowed disabled:opacity-50",
          selected ? `${selectedStyle.normal} text-fg-emphasized` : "bg-bg-subtle",
          !disabled && (selected ? selectedStyle.hovered : "hover:bg-bg-muted"),
          className,
        )}
        onClick={() => setPageState(page)}
        {...rest}
      >
        {children ? (
          children
        ) : pageType == "previous" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={"1em"}
            width={"1em"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        ) : pageType == "next" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={"1em"}
            width={"1em"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        ) : pageType == "end-ellipsis" || pageType == "start-ellipsis" ? (
          "..."
        ) : (
          page
        )}
      </Comp>
    );
  },
);

if (__DEV__) {
  PaginationItem.displayName = "PaginationItem";
}
