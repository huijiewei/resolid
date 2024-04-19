import { __DEV__ } from "@resolid/utils";
import type { BaseProps, EmptyProps } from "../slot/slot";
import { useBreadcrumb } from "./breadcrumb-context";

export const BreadcrumbSeparator = (props: BaseProps<"span", EmptyProps, "role">) => {
  const { separator } = useBreadcrumb();

  return (
    <span className={"inline-flex items-center text-fg-subtle"} aria-hidden="true" role="presentation" {...props}>
      {separator}
    </span>
  );
};

if (__DEV__) {
  BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
}
