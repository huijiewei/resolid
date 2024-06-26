import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { AngleRight } from "../../shared/icons";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { type BreadcrumbContext, BreadcrumbProvider } from "./breadcrumb-context";

export type BreadcrumbProps = BreadcrumbContext;

export const Breadcrumb = forwardRef<HTMLElement, BaseProps<"nav", BreadcrumbProps>>((props, ref) => {
  const { children, className, separator = <AngleRight />, ...rest } = props;

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
