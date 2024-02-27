import { __DEV__ } from "@resolid/utils";
import { useCallbackRef } from "../../hooks";
import type { BaseProps } from "../slot/Slot";
import { MenuGroup } from "./MenuGroup";
import { MenuRadioGroupProvider, type MenuRadioGroupContext } from "./MenuRadioGroupContext";

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
      <MenuGroup {...rest}></MenuGroup>
    </MenuRadioGroupProvider>
  );
};

if (__DEV__) {
  MenuRadioGroup.displayName = "MenuRadioGroup";
}
