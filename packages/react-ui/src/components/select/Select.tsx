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
  type ReactNode,
} from "react";
import { useCallbackRef, useControllableState, useIsomorphicEffect, usePrevious } from "../../hooks";
import { clsx } from "../../utils/classed";
import { ariaAttr, dataAttr } from "../../utils/dom";
import type { Size } from "../../utils/types";
import { CloseButton } from "../close-button/CloseButton";
import { Divider } from "../divider/Divider";
import { Portal } from "../portal/Portal";
import { selectSizeStyles } from "./Select.styles";
import { SelectChevron } from "./SelectChevron";
import { SelectProvider, type OptionBase, type OptionDefault, type OptionFieldNames } from "./SelectContext";
import { SelectOption, type OptionRender } from "./SelectOption";

type LabelRender<Option> = (option: Option) => ReactNode;

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
  labelRender?: LabelRender<Omit<Option, keyof OptionFieldNames["options"]>>;

  /**
   * 选项渲染方法
   */
  optionRender?: OptionRender<Omit<Option, keyof OptionFieldNames["options"]>>;

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
    optionRender,
    labelRender,
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

  const [state, setState] = useControllableState({
    value: value,
    defaultValue: defaultValue,
    onChange,
  });

  const { filterOptions, selectOptions, optionArray } = useMemo(() => {
    const filterOptions: Option[] = [];
    const selectOptions: (Omit<Option, keyof OptionFieldNames["options"]> & { index: number })[] = [];
    const optionArray: Omit<Option, keyof OptionFieldNames["options"]>[] = [];

    let optionIndex = 0;
    let hasGroupOptions = false;

    const pushOption = (option: Option) => {
      filterOptions.push(option);

      if (option[mergedFieldNames.options]) {
        hasGroupOptions = true;
        option[mergedFieldNames.options].forEach((groupOption: Omit<Option, keyof OptionFieldNames["options"]>) => {
          optionArray.push(groupOption);

          if (Array.isArray(state)) {
            if (state.includes(groupOption[mergedFieldNames.value])) {
              selectOptions.push({ ...groupOption, index: optionIndex });
            }
          } else {
            if (state == groupOption[mergedFieldNames.value]) {
              selectOptions.push({ ...groupOption, index: optionIndex });
            }
          }
        });
      } else {
        optionArray.push(option);

        if (Array.isArray(state)) {
          if (state.includes(option[mergedFieldNames.value])) {
            selectOptions.push({ ...option, index: optionIndex });
          }
        } else {
          if (state == option[mergedFieldNames.value]) {
            selectOptions.push({ ...option, index: optionIndex });
          }
        }
      }

      optionIndex++;
    };

    options.forEach((option) => {
      pushOption(option);
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
      disabledIndices: [],
    }),
  ]);

  const [scrollState, setScrollState] = useState(false);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  const labelRenderRef = useCallbackRef<Option, ReactNode>(labelRender ?? ((option) => option[mergedFieldNames.label]));

  const renderSingleValue = (selectOption: Omit<Option, keyof OptionFieldNames["options"]> | undefined) => {
    return selectOption ? labelRenderRef(selectOption) : <span className={"text-fg-subtle"}>{placeholder}</span>;
  };

  const renderMultipleValue = (selectOptions: Omit<Option, keyof OptionFieldNames["options"]>[]) => {
    return selectOptions.length > 0 ? (
      <div className={clsx("flex flex-wrap gap-1", sizeStyle.multipleWrap)}>
        {selectOptions.map((option) => (
          <div
            className={clsx("flex items-center gap-1 rounded bg-bg-subtle", sizeStyle.multipleItem)}
            key={option[mergedFieldNames.value]}
          >
            {labelRenderRef(option)}
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
  const sizeOptionStyle = clsx(sizeStyle.text, sizeStyle.option);

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

  const render = optionRender ?? ((option) => option[mergedFieldNames.label]);

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
      const floating = refs.floating.current;

      if (floating) {
        const item =
          activeIndex != null
            ? elementsRef.current[activeIndex]
            : minSelectedIndex != null
              ? elementsRef.current[minSelectedIndex]
              : null;

        if (item && prevActiveIndex != null) {
          const itemHeight = elementsRef.current[prevActiveIndex]?.offsetHeight || 0;

          const floatingHeight = floating.offsetHeight;
          const top = item.offsetTop - itemHeight;
          const bottom = top + itemHeight * 3;

          if (top < floating.scrollTop) {
            floating.scrollTop -= floating.scrollTop - top + 6;
          } else if (bottom > floatingHeight + floating.scrollTop) {
            floating.scrollTop += bottom - floatingHeight - floating.scrollTop + 6;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedState, scrollState, prevActiveIndex, activeIndex, minSelectedIndex, refs.floating, virtual]);

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
        const floating = refs.floating.current;

        if (floating && floating.offsetHeight < floating.scrollHeight) {
          const item = elementsRef.current[minSelectedIndex];

          if (item) {
            floating.scrollTop = item.offsetTop - floating.offsetHeight / 2 + item.offsetHeight / 2 + 9;
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedState, minSelectedIndex, middlewareData, refs.floating, virtual]);

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
          "focus-within:border-bg-primary-emphasis focus-within:ring-1 focus-within:ring-bg-primary-emphasis",
          invalid && "border-red-500",
          disabled
            ? "pointer-events-none cursor-not-allowed bg-bg-subtle opacity-60"
            : "active:border-bg-primary-emphasis active:ring-1 active:ring-bg-primary-emphasis",
          !invalid && !disabled && !openedState && "hover:border-border-hovered",
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
            ref={refs.setFloating}
            className={clsx(
              "max-h-80 overflow-y-auto overscroll-contain rounded border border-bg-muted bg-bg-normal shadow outline-none scrollbar scrollbar-thin",
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
              className={"outline-none"}
              style={
                virtual ? { height: `${rowVirtual.getTotalSize()}px`, width: "100%", position: "relative" } : undefined
              }
              {...getFloatingProps({})}
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
                        className={sizeOptionStyle}
                        key={`item-${option[mergedFieldNames.value]}`}
                        option={option}
                        render={render}
                        onSelect={handleSelect}
                      />
                    );
                  })
                ) : filterOptions.length > 0 ? (
                  filterOptions.map((option, index) => {
                    if (option[mergedFieldNames.options]) {
                      return (
                        <Fragment key={`group-${index}`}>
                          <Divider className={"mb-1 text-fg-subtle [&:not(:first-child)]:mt-1"}>
                            {option[mergedFieldNames.label]}
                          </Divider>
                          {option[mergedFieldNames.options].map(
                            (groupOption: Omit<Option, keyof OptionFieldNames["options"]>) => {
                              const selectOption = (
                                <SelectOption<Option>
                                  index={optionIndex}
                                  className={sizeOptionStyle}
                                  key={`item-${groupOption[mergedFieldNames.value]}`}
                                  option={groupOption}
                                  render={render}
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
                          className={sizeOptionStyle}
                          key={`item-${option[mergedFieldNames.value]}`}
                          option={option}
                          render={render}
                          onSelect={handleSelect}
                        />
                      );

                      optionIndex++;

                      return selectOption;
                    }
                  })
                ) : (
                  <li className={"text-center"}>无数据</li>
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
