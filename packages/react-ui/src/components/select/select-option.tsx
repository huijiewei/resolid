import type { Overwrite } from "@resolid/utils";
import { type ComponentPropsWithoutRef, type ForwardedRef, type ReactNode, forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { ariaAttr, dataAttr } from "../../utils/dom";
import { type OptionBase, type OptionDefault, type OptionFieldNames, useSelect } from "./select-context";

export type Render<Option> = (option: Option) => ReactNode;

export type SelectOptionProps<Option extends OptionBase> = {
  option: Omit<Option, keyof OptionFieldNames["options"]>;
  onSelect: (option: Omit<Option, keyof OptionFieldNames["options"]>) => void;
  render: Render<Omit<Option, keyof OptionFieldNames["options"]>>;
  index: number;
};

const SelectOptionImpl = <Option extends OptionBase = OptionDefault>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"div">, "children">, SelectOptionProps<Option>>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { option, onSelect, render, index, className, ...rest } = props;

  const { activeIndex, selectedIndex, getItemProps, elementsRef } = useSelect();

  const refs = useMergeRefs(ref, (node) => {
    // eslint-disable-next-line react-compiler/react-compiler
    elementsRef.current[index] = node;
  });

  const isActive = index == activeIndex;
  const isSelect = selectedIndex.includes(index);

  return (
    <div
      ref={refs}
      role="option"
      data-active={dataAttr(isActive)}
      aria-selected={ariaAttr(isSelect)}
      aria-disabled={ariaAttr(option.disabled)}
      tabIndex={isActive ? 0 : -1}
      className={clsx(
        "w-full select-none rounded outline-none transition-colors",
        option.disabled ? "text-fg-subtlest" : "active:bg-bg-subtle",
        isSelect && "text-fg-primary font-medium",
        className,
      )}
      {...getItemProps({
        onClick: () => {
          if (option.disabled) {
            return;
          }

          onSelect(option);
        },
      })}
      {...rest}
    >
      {render(option)}
    </div>
  );
};

export const SelectOption = forwardRef(SelectOptionImpl) as <Option extends OptionBase>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"div">, "children">, SelectOptionProps<Option>> & {
    ref?: ForwardedRef<HTMLDivElement>;
  },
) => ReturnType<typeof SelectOptionImpl>;
