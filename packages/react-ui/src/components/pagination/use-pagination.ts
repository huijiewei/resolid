import { isNumber } from "@resolid/utils";
import { useMemo } from "react";
import { useControllableState } from "../../hooks";

export type UsePaginationOptions = {
  /**
   * 当前分页
   */
  page?: number;

  /**
   * 默认分页
   * @default 1
   */
  defaultPage?: number;

  /**
   * 总记录数
   */
  total: number;

  /**
   * 分页大小
   * @default 20
   */
  pageSize?: number;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 相邻页码数, 当前页面之前和之后显示的页数
   * @default 2
   */
  siblings?: number;

  /**
   * 边界页码数, 分页开头和结尾处显示的页数
   * @default 2
   */
  boundaries?: number;

  /**
   * onChange 回调
   */
  onChange?: (page: number) => void;
};

export type PageType = "page" | "next" | "previous" | "start-ellipsis" | "end-ellipsis";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

export const usePagination = (
  options: UsePaginationOptions,
): {
  pages: { type: PageType; page: number; disabled: boolean }[];
  totalPage: number;
  pageState: number;
  setPageState: (page: number) => void;
} => {
  const {
    page,
    defaultPage = 1,
    onChange,
    total,
    pageSize = 20,
    siblings = 2,
    boundaries = 2,
    disabled = false,
  } = options;

  const totalPage = Math.max(1, Math.ceil(total / pageSize));

  const [pageState, setPageState] = useControllableState<number>({
    value: page,
    defaultValue: defaultPage,
    onChange,
  });

  // ['previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next']
  const pages = useMemo(() => {
    const siblingsStart = Math.max(
      Math.min(pageState - siblings, totalPage - boundaries - siblings * 2 - 1),
      boundaries + 2,
    );

    const endPages = range(Math.max(totalPage - boundaries + 1, boundaries + 1), totalPage);

    const siblingsEnd = Math.min(
      Math.max(pageState + siblings, boundaries + siblings * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : totalPage - 1,
    );

    return [
      ...[["previous", Math.max(1, pageState - 1)]],
      ...range(1, Math.min(boundaries, totalPage)),
      ...(siblingsStart > boundaries + 2
        ? [["start-ellipsis", Math.max(1, siblingsStart - 1)]]
        : boundaries + 1 < totalPage - boundaries
          ? [boundaries + 1]
          : []),
      ...range(siblingsStart, siblingsEnd),
      ...(siblingsEnd < totalPage - boundaries - 1
        ? [["end-ellipsis", Math.min(totalPage, siblingsEnd + 1)]]
        : totalPage - boundaries > boundaries
          ? [totalPage - boundaries]
          : []),
      ...endPages,
      ...[["next", Math.min(totalPage, pageState + 1)]],
    ].map((page) => {
      return isNumber(page)
        ? { type: "page" as PageType, page: page, disabled: disabled }
        : {
            type: page[0] as PageType,
            page: page[1] as number,
            disabled:
              disabled || (page[0] == "previous" && pageState <= 1) || (page[0] == "next" && pageState >= totalPage),
          };
    });
  }, [boundaries, disabled, pageState, siblings, totalPage]);

  return { pages, totalPage, pageState, setPageState };
};
