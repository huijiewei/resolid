import { __DEV__ } from "@resolid/utils";
import type { BaseProps, EmptyProps } from "../slot/Slot";
import { useBreadcrumb } from "./breadcrumbContext";

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
