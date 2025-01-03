import { __DEV__ } from "@resolid/utils";
import type { BaseProps, EmptyProps } from "../slot/slot";
import { useBreadcrumb } from "./breadcrumb-context";

export const BreadcrumbSeparator = (props: BaseProps<"span", EmptyProps, "role">) => {
  const { separator } = useBreadcrumb();

  return (
    <span className={"text-fg-subtle inline-flex items-center"} aria-hidden="true" role="presentation" {...props}>
      {separator}
    </span>
  );
};

if (__DEV__) {
  BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
}
