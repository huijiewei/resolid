import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { type AsChildProps, Slot } from "../slot/slot";

export type BreadcrumbLinkProps = {
  /**
   * 面包屑链接是否代表当前页面。
   */
  current?: boolean;
};

export const BreadcrumbLink = (props: AsChildProps<"a", BreadcrumbLinkProps>) => {
  const { asChild = false, children, className, href, current, ...rest } = props;

  if (current) {
    return (
      <span className={clsx("text-fg-muted inline-flex items-center", className)} aria-current="page" {...rest}>
        {children}
      </span>
    );
  }

  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      href={href}
      className={clsx("hover:text-link-hovered inline-flex cursor-pointer items-center", className)}
      {...rest}
    >
      {children}
    </Comp>
  );
};

if (__DEV__) {
  BreadcrumbLink.displayName = "BreadcrumbLink";
}
