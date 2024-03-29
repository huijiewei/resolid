import type { Overwrite } from "@resolid/utils";
import { forwardRef, type ComponentPropsWithoutRef, type ForwardedRef, type ReactNode } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { useSelect, type OptionBase, type OptionDefault, type OptionFieldNames } from "./SelectContext";

export type OptionRender<Option> = (option: Option, selected?: boolean) => ReactNode;

export type SelectOptionProps<Option extends OptionBase> = {
  option: Omit<Option, keyof OptionFieldNames["options"]>;
  onSelect: (option: Omit<Option, keyof OptionFieldNames["options"]>) => void;
  render: OptionRender<Omit<Option, keyof OptionFieldNames["options"]>>;
  index: number;
};

const SelectOptionInner = <Option extends OptionBase = OptionDefault>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"li">, "children">, SelectOptionProps<Option>>,
  ref: ForwardedRef<HTMLLIElement>,
) => {
  const { option, onSelect, render, index, className, ...rest } = props;

  const { activeIndex, selectedIndex, getItemProps, elementsRef } = useSelect();

  const refs = useMergeRefs(ref, (node) => {
    elementsRef.current[index] = node;
  });

  const isActive = index === activeIndex && index !== null;
  const isSelect = selectedIndex.includes(index);

  return (
    <li
      ref={refs}
      role="option"
      data-active={dataAttr(isActive)}
      aria-selected={isSelect}
      tabIndex={isActive ? 0 : -1}
      className={clsx(
        "w-full select-none rounded outline-none transition-colors",
        option.disabled ? "pointer-events-none text-fg-muted" : "active:bg-bg-subtle",
        isSelect && "text-fg-primary",
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
      {render(option, isSelect)}
    </li>
  );
};

export const SelectOption = forwardRef(SelectOptionInner) as <Option extends OptionBase>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"li">, "children">, SelectOptionProps<Option>> & {
    ref?: ForwardedRef<HTMLLIElement>;
  },
) => ReturnType<typeof SelectOptionInner>;
