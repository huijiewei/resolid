import { __DEV__ } from "@resolid/utils";
import type { BaseProps } from "../slot/Slot";

export const MenuGroup = (props: BaseProps<"div">) => {
  const { children, ...rest } = props;

  return (
    <div role={"group"} {...rest}>
      {children}
    </div>
  );
};

if (__DEV__) {
  MenuGroup.displayName = "MenuGroup";
}
