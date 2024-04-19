import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { Slot, type AsChildProps } from "../slot/slot";

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
      <span className={clsx("inline-flex items-center text-fg-muted", className)} aria-current="page" {...rest}>
        {children}
      </span>
    );
  }

  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      href={href}
      className={clsx("inline-flex cursor-pointer items-center hover:text-link-hovered", className)}
      {...rest}
    >
      {children}
    </Comp>
  );
};

if (__DEV__) {
  BreadcrumbLink.displayName = "BreadcrumbLink";
}
