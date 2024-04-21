import { __DEV__ } from "@resolid/utils";
import { useCallbackRef } from "../../hooks";
import type { BaseProps } from "../slot/slot";
import { MenuGroup } from "./menu-group";
import { MenuRadioGroupProvider, type MenuRadioGroupContext } from "./menu-radio-group-context";

export type MenuRadioGroupProps = MenuRadioGroupContext;

export const MenuRadioGroup = (props: BaseProps<"div", MenuRadioGroupProps>) => {
  const { value, onChange, ...rest } = props;

  const handleChange = useCallbackRef(onChange);

  return (
    <MenuRadioGroupProvider
      value={{
        value,
        onChange: handleChange,
      }}
    >
      <MenuGroup {...rest} />
    </MenuRadioGroupProvider>
  );
};

if (__DEV__) {
  MenuRadioGroup.displayName = "MenuRadioGroup";
}
