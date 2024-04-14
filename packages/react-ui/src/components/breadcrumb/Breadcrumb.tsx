import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { BreadcrumbProvider, type BreadcrumbContext } from "./breadcrumbContext";

export type BreadcrumbProps = BreadcrumbContext;

export const Breadcrumb = forwardRef<HTMLElement, BaseProps<"nav", BreadcrumbProps>>((props, ref) => {
  const {
    children,
    className,
    separator = (
      <svg width={"1.125em"} height={"1.125em"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 5L7 19"
        ></path>
      </svg>
    ),
    ...rest
  } = props;

  return (
    <nav ref={ref} aria-label="breadcrumb" {...rest}>
      <BreadcrumbProvider value={{ separator }}>
        <ol className={clsx("inline-flex items-center", className)}>{children}</ol>
      </BreadcrumbProvider>
    </nav>
  );
});

if (__DEV__) {
  Breadcrumb.displayName = "Breadcrumb";
}
