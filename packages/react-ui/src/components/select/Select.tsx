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
  Fragment,
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
import { CloseButton } from "../close-button/CloseButton";
import { Portal } from "../portal/Portal";
import { SelectChevron } from "./SelectChevron";
import { SelectOption, type Render } from "./SelectOption";
import { selectSizeStyles } from "./select.styles";
import { SelectProvider, type OptionBase, type OptionDefault, type OptionFieldNames } from "./selectContext";

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

const SelectInner = <Option extends OptionBase = OptionDefault>(
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

  const [state, setState] = useControllableState({ value, defaultValue, onChange });

  const { filterOptions, selectOptions, optionArray } = useMemo(() => {
    const filterOptions: Option[] = [];
    const selectOptions: (Omit<Option, keyof OptionFieldNames["options"]> & { index: number })[] = [];
    const optionArray: Omit<Option, keyof OptionFieldNames["options"]>[] = [];

    let optionIndex = 0;
    let hasGroupOptions = false;

    const isSelected = (option: Option) => {
      return Array.isArray(state)
        ? state.includes(option[mergedFieldNames.value])
        : state == option[mergedFieldNames.value];
    };

    options.forEach((option) => {
      if (option[mergedFieldNames.options]) {
        hasGroupOptions = true;

        const filterChildren = [];

        option[mergedFieldNames.options].forEach((child: Option) => {
          if (isSelected(child)) {
            selectOptions.push({ ...child, index: optionIndex });
          }

          optionIndex++;
          optionArray.push(child);
          filterChildren.push(child);
        });

        if (filterChildren.length > 0) {
          filterOptions.push(option);
        }
      } else {
        if (isSelected(option)) {
          selectOptions.push({ ...option, index: optionIndex });
        }

        optionIndex++;
        optionArray.push(option);
        filterOptions.push(option);
      }
    });

    setVirtual(!hasGroupOptions && options.length > 30);

    return { filterOptions, selectOptions, optionArray };
  }, [mergedFieldNames.options, mergedFieldNames.value, options, state]);

  const [openedState, setOpenedState] = useState(false);

  const { floatingStyles, context, refs, middlewareData } = useFloating<HTMLElement>({
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

  const elementsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const minSelectedIndex = selectOptions[0]?.index ?? null;

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context, { keyboardHandlers: closeOnSelect }),
    useRole(context, { role: "listbox" }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
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

  const renderSingleValue = (selectOption: Omit<Option, keyof OptionFieldNames["options"]> | undefined) => {
    return selectOption ? renderLabelRef(selectOption) : <span className={"text-fg-subtle"}>{placeholder}</span>;
  };

  const renderMultipleValue = (selectOptions: Omit<Option, keyof OptionFieldNames["options"]>[]) => {
    return selectOptions.length > 0 ? (
      <div className={clsx("flex flex-wrap gap-1", sizeStyle.multipleWrap)}>
        {selectOptions.map((option) => (
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
      const multiple = Array.isArray(state);
      const value = option[mergedFieldNames.value] as string | number;

      let nextValue;

      if (multiple) {
        if (state.includes(value)) {
          onDeselect && onDeselect(value, option);
          nextValue = state.filter((p) => p != value);
        } else {
          onSelect && onSelect(value, option);
          nextValue = [...state, value];
        }
      } else {
        if (value == state) {
          onDeselect && onDeselect(value, option);
          nextValue = null;
        } else {
          onSelect && onSelect(value, option);
          nextValue = value;
        }
      }

      setState(nextValue);

      if (closeOnSelect && close) {
        setOpenedState(false);
        setActiveIndex(null);
      }

      requestAnimationFrame(() => {
        refs.domReference.current?.focus();
      });
    },
    [closeOnSelect, mergedFieldNames.value, onDeselect, onSelect, refs.domReference, setState, state],
  );

  const renderOptionRef = useCallbackRef(renderOption ?? ((option) => option[mergedFieldNames.label]));

  const selectContext = useMemo(() => {
    return {
      activeIndex,
      selectedIndex: selectOptions.map((option) => option.index),
      getItemProps,
      elementsRef,
      fieldNames: mergedFieldNames,
    };
  }, [activeIndex, getItemProps, mergedFieldNames, selectOptions]);

  const rowVirtual = useVirtualizer({
    count: optionArray.length,
    getScrollElement: () => refs.floating.current,
    estimateSize: () => sizeStyle.height,
    overscan: 3,
    paddingStart: 6,
    paddingEnd: 6,
    scrollPaddingStart: 6,
    scrollPaddingEnd: 6,
  });

  const prevActiveIndex = usePrevious<number | null>(activeIndex);

  useIsomorphicEffect(() => {
    if (!openedState) {
      return;
    }

    if (!scrollState) {
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
          const itemHeight = elementsRef.current[prevActiveIndex]?.offsetHeight || 0;

          const scrollHeight = scrollElement.offsetHeight;
          const top = item.offsetTop - itemHeight;
          const bottom = top + itemHeight * 3;

          if (top < scrollElement.scrollTop) {
            scrollElement.scrollTop -= scrollElement.scrollTop - top + 6;
          } else if (bottom > scrollHeight + scrollElement.scrollTop) {
            scrollElement.scrollTop += bottom - scrollHeight - scrollElement.scrollTop + 6;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedState, scrollState, prevActiveIndex, activeIndex, minSelectedIndex, virtual]);

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
            scrollElement.scrollTop = item.offsetTop - scrollElement.offsetHeight / 2 + item.offsetHeight / 2 + 9;
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedState, minSelectedIndex, middlewareData, virtual]);

  let optionIndex = 0;

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

            if (activeIndex != null) {
              if (event.key == "Enter") {
                event.preventDefault();
                handleSelect(optionArray[activeIndex]);
              }
            }

            if (event.key == " ") {
              event.preventDefault();
            }

            if (event.key == "Tab") {
              setOpenedState(false);
            }

            if (event.key == "Delete" || event.key == "Backspace") {
              if (Array.isArray(state)) {
                const lastSelectOption = selectOptions.at(-1);

                if (lastSelectOption != undefined) {
                  handleSelect(lastSelectOption, false);
                }
              }
            }
          },
          onKeyUp(event) {
            setScrollState(true);

            if (activeIndex != null) {
              if (event.key == " ") {
                event.preventDefault();
                handleSelect(optionArray[activeIndex]);
              }
            }
          },
        })}
      >
        <div className={"select-none"}>
          {Array.isArray(state) ? renderMultipleValue(selectOptions) : renderSingleValue(selectOptions[0])}
        </div>
        <span
          className={clsx(
            "pointer-events-none absolute bottom-0 right-0 top-0 flex items-center justify-center",
            sizeStyle.chevron,
          )}
        >
          <SelectChevron />
        </span>
        {Array.isArray(state) ? (
          state?.map((value) => (
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
            value={state || ""}
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
              "max-h-80 overflow-y-auto overscroll-contain scrollbar scrollbar-thin",
              virtual ? "px-1" : "p-1",
              "transition-opacity duration-[--duration-var]",
              status == "open" ? "opacity-100" : "opacity-0",
            )}
            style={
              {
                ...floatingStyles,
                "--duration-var": `${duration}ms`,
              } as CSSProperties
            }
          >
            <ul
              className={clsx("outline-none", sizeStyle.text)}
              style={
                virtual ? { height: `${rowVirtual.getTotalSize()}px`, width: "100%", position: "relative" } : undefined
              }
              {...getFloatingProps()}
            >
              <SelectProvider value={selectContext}>
                {virtual ? (
                  rowVirtual.getVirtualItems().map((row) => {
                    const option = filterOptions[row.index];

                    return (
                      <SelectOption<Option>
                        index={row.index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          transform: `translateY(${row.start}px)`,
                        }}
                        className={sizeStyle.option}
                        key={`item-${option[mergedFieldNames.value]}`}
                        option={option}
                        render={renderOptionRef}
                        onSelect={handleSelect}
                      />
                    );
                  })
                ) : filterOptions.length > 0 ? (
                  filterOptions.map((option, index) => {
                    if (option[mergedFieldNames.options]) {
                      return (
                        <Fragment key={`group-${index}`}>
                          <li
                            role={"separator"}
                            aria-disabled
                            className={clsx("text-[0.875em] text-fg-subtle", sizeStyle.option)}
                          >
                            {option[mergedFieldNames.label]}
                          </li>
                          {option[mergedFieldNames.options].map(
                            (groupOption: Omit<Option, keyof OptionFieldNames["options"]>) => {
                              const selectOption = (
                                <SelectOption<Option>
                                  index={optionIndex}
                                  className={sizeStyle.option}
                                  key={`item-${groupOption[mergedFieldNames.value]}`}
                                  option={groupOption}
                                  render={renderOptionRef}
                                  onSelect={handleSelect}
                                />
                              );

                              optionIndex++;

                              return selectOption;
                            },
                          )}
                        </Fragment>
                      );
                    } else {
                      const selectOption = (
                        <SelectOption<Option>
                          index={optionIndex}
                          className={sizeStyle.option}
                          key={`item-${option[mergedFieldNames.value]}`}
                          option={option}
                          render={renderOptionRef}
                          onSelect={handleSelect}
                        />
                      );

                      optionIndex++;

                      return selectOption;
                    }
                  })
                ) : (
                  <li className={clsx("text-center", sizeStyle.option)}>无数据</li>
                )}
              </SelectProvider>
            </ul>
          </div>
        </Portal>
      )}
    </>
  );
};

export const Select = forwardRef(SelectInner) as <Option extends OptionBase>(
  props: Overwrite<Omit<ComponentPropsWithoutRef<"input">, "children">, SelectProps<Option>> & {
    ref?: ForwardedRef<HTMLInputElement>;
  },
) => ReturnType<typeof SelectInner>;
