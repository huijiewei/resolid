import {
  autoUpdate,
  flip,
  size as floatingSize,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import type { Overwrite } from "@resolid/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from "react";
import { useCallbackRef, useControllableState, useIsomorphicEffect, usePrevious } from "../../hooks";
import { focusInputStyles } from "../../shared/styles";
import { clsx } from "../../utils/classed";
import { ariaAttr, dataAttr } from "../../utils/dom";
import type { Size } from "../../utils/types";
import { CloseButton } from "../close-button/close-button";
import { Portal } from "../portal/portal";
import { SelectChevron } from "./select-chevron";
import { SelectProvider, type OptionBase, type OptionDefault, type OptionFieldNames } from "./select-context";
import { SelectOption, type Render } from "./select-option";
import { selectSizeStyles } from "./select.styles";

export type SelectProps<Option extends OptionBase> = {
  /**
   * 选择用于在下拉列表中呈现项目的选项
   */
  options: readonly Option[];

  /**
   * 选项字段名称
   */
  fieldNames?: OptionFieldNames;

  /**
   * 大小
   * @default 'md'
   */
  size?: Size;

  /**
   * 是否多选
   * @default false
   */
  multiple?: boolean;

  /**
   * 占位符文本
   * @default '请选择...'
   */
  placeholder?: string;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否必须
   * @default false
   */
  required?: boolean;

  /**
   * 是否无效
   * @default false
   */
  invalid?: boolean;

  /**
   * 是否全宽度
   * @default false
   */
  block?: boolean;

  /**
   * 可控值
   */
  value?: (string | number)[] | string | number | null;

  /**
   * 默认值
   */
  defaultValue?: (string | number)[] | string | number | null;

  /**
   * 选择后关闭
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * onChange 回调
   */
  onChange?: (value: (string | number)[] | string | number | null) => void;

  /**
   * onSearch 回调
   */
  onSearch?: (value: string) => void;

  /**
   * onSelect 回调
   */
  onSelect?: (value: string | number | null, option: Omit<Option, keyof OptionFieldNames["options"]>) => void;

  /**
   * onDeselect 回调
   */
  onDeselect?: (value: string | number | null, option: Omit<Option, keyof OptionFieldNames["options"]>) => void;

  /**
   * 标签渲染方法
   */
  renderLabel?: Render<Omit<Option, keyof OptionFieldNames["options"]>>;

  /**
   * 选项渲染方法
   */
  renderOption?: Render<Omit<Option, keyof OptionFieldNames["options"]>>;

  /**
   * 动画持续时间
   * @default '250'
   */
  duration?: number;
};

const SelectImpl = <Option extends OptionBase = OptionDefault>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"input">, "children">, SelectProps<Option>>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const {
    id,
    name,
    options,
    fieldNames,
    size = "md",
    placeholder = "请选择...",
    onChange,
    onSelect,
    onDeselect,
    disabled = false,
    required = false,
    readOnly = false,
    invalid = false,
    multiple = false,
    className,
    block = false,
    value,
    defaultValue = multiple ? [] : undefined,
    closeOnSelect = true,
    style,
    renderOption,
    renderLabel,
    duration = 250,
    ...rest
  } = props;

  const [virtual, setVirtual] = useState(false);

  const mergedFieldNames = useMemo(
    () => ({
      value: fieldNames?.value ?? "value",
      label: fieldNames?.label ?? "label",
      options: fieldNames?.options ?? "options",
    }),
    [fieldNames],
  );

  const [valueState, setValueState] = useControllableState({ value, defaultValue, onChange });

  const { optionNodes, optionItems, selectedOptions } = useMemo(() => {
    type IndexedOption = Omit<Option, keyof OptionFieldNames["options"]> & { __index: number };

    const selectedOptions: IndexedOption[] = [];
    const optionNodes: (IndexedOption & { __group?: boolean })[] = [];
    const optionItems: Omit<Option, keyof OptionFieldNames["options"]>[] = [];

    let groupIndex = 0;
    let optionIndex = 0;

    const isSelected = (option: Option) => {
      return Array.isArray(valueState)
        ? valueState.includes(option[mergedFieldNames.value])
        : valueState == option[mergedFieldNames.value];
    };

    for (const option of options) {
      if (option[mergedFieldNames.options]) {
        optionNodes.push({ ...option, __index: groupIndex, __group: true });

        for (const child of option[mergedFieldNames.options]) {
          optionItems.push(child);

          const indexedChild = { ...child, __index: optionIndex };

          if (isSelected(child)) {
            selectedOptions.push(indexedChild);
          }

          optionNodes.push(indexedChild);

          optionIndex++;
        }

        groupIndex++;
      } else {
        optionItems.push(option);

        const indexedOption = { ...option, __index: optionIndex };

        if (isSelected(option)) {
          selectedOptions.push(indexedOption);
        }

        optionNodes.push(indexedOption);

        optionIndex++;
      }
    }

    setVirtual(groupIndex == 0 && options.length > 30);

    return { optionNodes, optionItems, selectedOptions };
  }, [mergedFieldNames.options, mergedFieldNames.value, options, valueState]);

  const [openedState, setOpenedState] = useState(false);

  const { floatingStyles, context, refs } = useFloating<HTMLElement>({
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      floatingSize({
        apply({ availableWidth, elements, rects }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            minWidth: `${rects.reference.width}px`,
          });
        },
        padding: 8,
      }),
    ],
    open: openedState,
    onOpenChange: (opened) => {
      setOpenedState(opened);
    },
    whileElementsMounted: autoUpdate,
  });

  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const minSelectedIndex = selectedOptions[0]?.__index ?? null;

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context, { keyboardHandlers: closeOnSelect }),
    useRole(context, { role: "listbox" }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      focusItemOnOpen: true,
      selectedIndex: minSelectedIndex,
      onNavigate: setActiveIndex,
      loop: true,
      virtual: true,
    }),
  ]);

  const [scrollState, setScrollState] = useState(false);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  const renderLabelRef = useCallbackRef(renderLabel ?? ((option) => option[mergedFieldNames.label]));

  const renderSingleValue = (option: Omit<Option, keyof OptionFieldNames["options"]> | undefined) => {
    return option ? renderLabelRef(option) : <span className={"text-fg-subtle"}>{placeholder}</span>;
  };

  const renderMultipleValue = (options: Omit<Option, keyof OptionFieldNames["options"]>[]) => {
    return options.length > 0 ? (
      <div className={clsx("flex flex-wrap gap-1", sizeStyle.multipleWrap)}>
        {options.map((option) => (
          <div
            className={clsx("flex items-center gap-1 rounded bg-bg-subtle", sizeStyle.multipleItem)}
            key={option[mergedFieldNames.value]}
          >
            {renderLabelRef(option)}
            <CloseButton
              size={"1em"}
              aria-label={`移除 ${option[mergedFieldNames.value]}`}
              onClick={(event) => {
                event.stopPropagation();
                handleSelect(option);
              }}
              statusClassName={"hover:bg-bg-subtlest hover:text-fg-danger active:bg-bg-muted"}
              className={"rounded-full p-[1px]"}
            />
          </div>
        ))}
      </div>
    ) : (
      <span className={"text-fg-subtle"}>{placeholder}</span>
    );
  };

  const sizeStyle = selectSizeStyles[size];

  const handleSelect = useCallback(
    (option: Omit<Option, keyof OptionFieldNames["options"]>, close = true) => {
      const multiple = Array.isArray(valueState);
      const value = option[mergedFieldNames.value] as string | number;

      if (multiple) {
        if (valueState.includes(value)) {
          onDeselect?.(value, option);
          setValueState(valueState.filter((p) => p != value));
        } else {
          onSelect?.(value, option);
          setValueState([...valueState, value]);
        }
      } else {
        if (value == valueState) {
          onDeselect?.(value, option);
          setValueState(null);
        } else {
          onSelect?.(value, option);
          setValueState(value);
        }
      }

      if (closeOnSelect && close) {
        setOpenedState(false);
        setActiveIndex(null);
      }

      requestAnimationFrame(() => {
        refs.domReference.current?.focus();
      });
    },
    [closeOnSelect, mergedFieldNames.value, onDeselect, onSelect, refs.domReference, setValueState, valueState],
  );

  const renderOptionRef = useCallbackRef(renderOption ?? ((option) => option[mergedFieldNames.label]));

  const selectContext = useMemo(() => {
    return {
      activeIndex,
      selectedIndex: selectedOptions.map((option) => option.__index),
      getItemProps,
      elementsRef,
      fieldNames: mergedFieldNames,
    };
  }, [activeIndex, getItemProps, mergedFieldNames, selectedOptions]);

  const rowVirtual = useVirtualizer({
    count: optionItems.length,
    getScrollElement: () => refs.floating.current,
    estimateSize: () => sizeStyle.height,
    overscan: 3,
    paddingStart: 4,
    paddingEnd: 4,
    scrollPaddingStart: 17,
    scrollPaddingEnd: 17,
  });

  const prevActiveIndex = usePrevious<number | null>(activeIndex);

  useIsomorphicEffect(() => {
    if (!openedState || !scrollState) {
      return;
    }

    if (virtual) {
      const scrollIndex = activeIndex != null ? activeIndex : minSelectedIndex != null ? minSelectedIndex - 1 : -1;

      if (scrollIndex > -1 && prevActiveIndex != null) {
        rowVirtual.scrollToIndex(scrollIndex > prevActiveIndex ? scrollIndex + 1 : scrollIndex - 1, {
          align: "auto",
        });
      }
    } else {
      const scrollElement = refs.floating.current;

      if (scrollElement) {
        const item =
          activeIndex != null
            ? elementsRef.current[activeIndex]
            : minSelectedIndex != null
              ? elementsRef.current[minSelectedIndex]
              : null;

        if (item && prevActiveIndex != null) {
          const offsetHeight = elementsRef.current[prevActiveIndex]?.offsetHeight || 0;

          const scrollHeight = scrollElement.offsetHeight;
          const top = item.offsetTop - offsetHeight;
          const bottom = top + offsetHeight * 3;

          if (top < scrollElement.scrollTop) {
            scrollElement.scrollTop -= scrollElement.scrollTop - top + 6;
          } else if (bottom > scrollHeight + scrollElement.scrollTop) {
            scrollElement.scrollTop += bottom - scrollHeight - scrollElement.scrollTop + 6;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedState, scrollState, virtual, prevActiveIndex, activeIndex, minSelectedIndex]);

  useIsomorphicEffect(() => {
    if (!openedState || !closeOnSelect) {
      return;
    }

    requestAnimationFrame(() => {
      if (virtual) {
        if (minSelectedIndex > -1) {
          rowVirtual.scrollToIndex(minSelectedIndex + 1, { align: "center" });
        }
      } else {
        const scrollElement = refs.floating.current;

        if (scrollElement && scrollElement.offsetHeight < scrollElement.scrollHeight) {
          const item = elementsRef.current[minSelectedIndex];

          if (item) {
            const scrollTop = item.offsetTop - scrollElement.offsetHeight / 2 + item.offsetHeight / 2;
            scrollElement.scrollTop = scrollTop > 0 ? scrollTop + 2 : scrollTop;
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedState, closeOnSelect, virtual, minSelectedIndex]);

  return (
    <>
      <div
        id={id}
        aria-haspopup={"listbox"}
        aria-expanded={openedState}
        tabIndex={disabled ? -1 : 0}
        data-active={dataAttr(openedState)}
        aria-required={ariaAttr(required)}
        aria-readonly={ariaAttr(readOnly)}
        ref={refs.setReference}
        className={clsx(
          "relative inline-flex items-center rounded border outline-none transition-colors",
          focusInputStyles,
          invalid && "border-bd-invalid",
          disabled
            ? "pointer-events-none cursor-not-allowed bg-bg-subtle opacity-60"
            : "active:border-bg-primary-emphasis active:ring-1 active:ring-bg-primary-emphasis",
          !invalid && !disabled && !openedState && "hover:border-bd-hovered",
          block && "w-full",
          sizeStyle.text,
          sizeStyle.select,
          className,
        )}
        {...getReferenceProps({
          role: "combobox",
          style: style,
          onPointerMove() {
            setScrollState(false);
          },
          onKeyDown(event) {
            setScrollState(true);

            if (activeIndex != null && event.key == "Enter") {
              handleSelect(optionItems[activeIndex]);
            }

            if (event.key == " ") {
              event.preventDefault();
            }

            if (event.key == "Tab" && openedState) {
              event.preventDefault();
            }

            if (event.key == "Delete" || event.key == "Backspace") {
              if (Array.isArray(valueState)) {
                const lastSelectOption = selectedOptions.at(-1);

                if (lastSelectOption != undefined) {
                  handleSelect(lastSelectOption, false);
                }
              }
            }
          },
          onKeyUp(event) {
            setScrollState(true);

            if (activeIndex != null && event.key == " ") {
              event.preventDefault();
              handleSelect(optionItems[activeIndex]);
            }
          },
        })}
      >
        <div className={"select-none"}>
          {Array.isArray(valueState) ? renderMultipleValue(selectedOptions) : renderSingleValue(selectedOptions[0])}
        </div>
        <span
          className={clsx(
            "pointer-events-none absolute bottom-0 right-0 top-0 flex items-center justify-center",
            sizeStyle.chevron,
          )}
        >
          <SelectChevron />
        </span>
        {Array.isArray(valueState) ? (
          valueState?.map((value) => (
            <input
              disabled={disabled}
              readOnly={readOnly}
              name={name && `${name}[]`}
              key={value}
              type={"hidden"}
              ref={ref}
              value={value}
              {...rest}
            />
          ))
        ) : (
          <input
            disabled={disabled}
            readOnly={readOnly}
            name={name}
            type={"hidden"}
            ref={ref}
            value={valueState || ""}
            {...rest}
          />
        )}
      </div>
      {isMounted && !readOnly && (
        <Portal>
          <div
            tabIndex={-1}
            ref={refs.setFloating}
            className={clsx(
              "z-popup rounded border bg-bg-normal shadow outline-none",
              "max-h-[calc(var(--option-height)*9+10px)] overflow-y-auto overscroll-contain scrollbar scrollbar-thin",
              virtual ? "px-1" : "p-1",
              "transition-opacity duration-[--duration-var]",
              status == "open" ? "opacity-100" : "opacity-0",
            )}
            style={
              {
                ...floatingStyles,
                "--duration-var": `${duration}ms`,
                "--option-height": `${sizeStyle.height}px`,
              } as CSSProperties
            }
          >
            <div
              className={clsx("outline-none", sizeStyle.text)}
              style={
                virtual ? { height: `${rowVirtual.getTotalSize()}px`, width: "100%", position: "relative" } : undefined
              }
              {...getFloatingProps()}
            >
              <SelectProvider value={selectContext}>
                {virtual ? (
                  rowVirtual.getVirtualItems().map((row) => {
                    const option = optionNodes[row.index];

                    return (
                      <SelectOption<Option>
                        index={option.__index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          transform: `translateY(${row.start}px)`,
                        }}
                        className={sizeStyle.option}
                        key={option[mergedFieldNames.value]}
                        option={option}
                        render={renderOptionRef}
                        onSelect={handleSelect}
                      />
                    );
                  })
                ) : optionNodes.length > 0 ? (
                  optionNodes.map((option) => {
                    if (option.__group) {
                      return (
                        <div
                          key={option.__index}
                          role={"separator"}
                          aria-disabled
                          className={clsx("text-[0.875em] text-fg-subtle", sizeStyle.option)}
                        >
                          {option[mergedFieldNames.label]}
                        </div>
                      );
                    }

                    return (
                      <SelectOption<Option>
                        index={option.__index}
                        className={sizeStyle.option}
                        key={option[mergedFieldNames.value]}
                        option={option}
                        render={renderOptionRef}
                        onSelect={handleSelect}
                      />
                    );
                  })
                ) : (
                  <li className={sizeStyle.option}>无数据</li>
                )}
              </SelectProvider>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export const Select = forwardRef(SelectImpl) as <Option extends OptionBase>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"input">, "children">, SelectProps<Option>> & {
    ref?: ForwardedRef<HTMLInputElement>;
  },
) => ReturnType<typeof SelectImpl>;
