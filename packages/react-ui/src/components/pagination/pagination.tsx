import { __DEV__ } from "@resolid/utils";
import type { ReactElement } from "react";
import { clsx } from "../../utils/classed";
import type { Color } from "../../utils/types";
import type { BaseProps } from "../slot/slot";
import { PaginationItem, type PaginationItemProps } from "./pagination-item";
import type { UsePaginationOptions } from "./use-pagination";
import { usePagination } from "./use-pagination";

export type PaginationProps = UsePaginationOptions & {
  /**
   * 颜色
   * @default 'primary'
   */
  color?: Color;

  /**
   * 总数显示渲染
   */
  renderTotal?: (total: number, totalPage: number) => ReactElement;

  /**
   * 分页项目渲染
   */
  renderPage?: (props: PaginationItemProps) => ReactElement;
};

export const Pagination = (props: BaseProps<"div", PaginationProps>) => {
  const {
    className,
    color = "primary",
    disabled = false,
    page,
    defaultPage,
    pageSize,
    total,
    siblings,
    boundaries,
    onChange,
    renderTotal,
    renderPage = (props) => <PaginationItem {...props} />,
    ...rest
  } = props;

  const { pages, totalPage, pageState, setPageState } = usePagination({
    page,
    defaultPage,
    total,
    pageSize,
    disabled,
    siblings,
    boundaries,
    onChange,
  });

  return (
    <div role={"navigation"} className={clsx("flex w-auto items-center gap-2", className)} {...rest}>
      {renderTotal && renderTotal(total, totalPage)}
      <ul className={"flex flex-nowrap gap-1"}>
        {pages.map((page) => (
          <li key={`${page.type}-${page.page}`}>
            {renderPage({
              color,
              disabled: page.disabled,
              page: page.page,
              pageType: page.type,
              pageState,
              setPageState,
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

if (__DEV__) {
  Pagination.displayName = "Pagination";
}
