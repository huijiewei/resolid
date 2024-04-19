import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";

export const AvatarBadge = (props: BaseProps<"span">) => {
  const { className, ...rest } = props;
  return (
    <span
      className={clsx(
        "absolute bottom-0 right-0 flex translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full",
        className,
      )}
      {...rest}
    />
  );
};

if (__DEV__) {
  AvatarBadge.displayName = "AvatarBadge";
}
