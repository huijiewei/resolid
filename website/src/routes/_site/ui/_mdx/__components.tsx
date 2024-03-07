import type { ComponentProp } from "@resolid/mdx-plugins";
import { Checkbox, clsx, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@resolid/react-ui";
import { isFunction } from "@resolid/utils";
import { useMemo, useState, type FunctionComponent, type ReactNode } from "react";

export const ComponentUsage = ({
  preview,
  componentProps = [],
  ignoreProps = [],
}: {
  preview: FunctionComponent;
  componentFile: string;
  componentProps?: ComponentProp[];
  ignoreProps?: string[];
}) => {
  const filteredProps = useMemo(() => {
    return componentProps.filter((prop) => {
      return (
        prop.name != "asChild" &&
        prop.type != "Element" &&
        !/^on[A-Z]/.test(prop.name) &&
        !ignoreProps.includes(prop.name)
      );
    });
  }, [componentProps, ignoreProps]);

  const [state, setState] = useState<Record<string, string | boolean | number>>(
    filteredProps.reduce((obj, item) => {
      return {
        ...obj,
        [item["name"]]:
          item["defaultValue"] == "true" || item["defaultValue"] == "false"
            ? item["defaultValue"] == "true"
            : item["defaultValue"]
              ? item["defaultValue"].substring(1, item["defaultValue"].length - 1)
              : undefined,
      };
    }, {}),
  );

  return (
    <div className={"not-prose flex min-h-52 w-full flex-col rounded border lg:flex-row"}>
      <div className={"flex flex-1 flex-col p-5"}>
        <div className={"flex flex-grow items-center justify-center"}>{preview(state)}</div>
      </div>
      <div className={"min-w-[15em] flex-shrink-0 border-t p-3 lg:border-s lg:border-t-0"}>
        <div className={"flex flex-col text-sm"}>
          {filteredProps.map((prop) => {
            const controlType = prop.type.includes("|") ? "select" : prop.type == "boolean" ? "checkbox" : "input";

            return (
              <label className={"flex h-9 items-center justify-between"} key={prop.name}>
                <div className={"capitalize"}>{prop.description}</div>
                {controlType == "checkbox" && (
                  <Checkbox
                    size={"sm"}
                    checked={Boolean(state[prop.name])}
                    onChange={(value) => {
                      setState((prev) => ({ ...prev, [prop.name]: value }));
                    }}
                  />
                )}
                {controlType == "input" && (
                  <input
                    className={"w-1/2 rounded border p-1"}
                    value={String(state[prop.name])}
                    onChange={(e) => {
                      setState((prev) => ({ ...prev, [prop.name]: e.target.value }));
                    }}
                  />
                )}
                {controlType == "select" && (
                  <select
                    className={"rounded border p-1"}
                    value={String(state[prop.name])}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        [prop.name]:
                          e.target.value == "true" || e.target.value == "false"
                            ? e.target.value == "true"
                            : e.target.value,
                      }));
                    }}
                  >
                    {prop.type.split(" | ").map((item) => {
                      if (item == "number") {
                        return null;
                      }

                      const option =
                        item != "true" && item != "false" ? item.trim().substring(1, item.length - 1) : item;

                      return (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ComponentProps = ({
  componentProps = [],
}: {
  componentFile: string;
  componentProps?: ComponentProp[];
}) => {
  return (
    <table className={"my-4 w-full table-auto border-separate rounded border border-bg-subtle"}>
      <thead>
        <tr className={"bg-bg-subtle"}>
          <th className={"hidden whitespace-nowrap p-2 text-left md:table-cell"}>属性</th>
          <th className={"hidden whitespace-nowrap p-2 text-left md:table-cell"}>类型</th>
          <th className={"hidden whitespace-nowrap p-2 text-center md:table-cell"}>默认值</th>
          <th className={"hidden whitespace-nowrap p-2 text-center md:table-cell"}>必须</th>
        </tr>
      </thead>
      <tbody>
        {componentProps?.map((prop, i) => (
          <tr
            className={
              "md:flex-no-wrap mb-[1px] flex flex-row flex-wrap border-b border-b-bg-subtle pb-[1px] last:mb-0 last:border-none last:pb-0 md:mb-0 md:table-row md:border-none"
            }
            key={`${prop.name}-${i}`}
          >
            <td className={"block w-full whitespace-nowrap font-bold md:table-cell md:w-auto md:p-2"}>
              <span className="mr-3 inline-block w-[5.5rem] bg-bg-subtle p-2 text-sm font-bold md:hidden">属性</span>
              <span className={"inline-flex items-center gap-2"}>
                {prop.name}
                {prop.description && (
                  <Popover>
                    <PopoverTrigger>
                      <svg width={"1rem"} height={"1rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8.01 8.01 0 0 1-8 8m0-8.5a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-1-1m0-4a1.25 1.25 0 1 0 1.25 1.25A1.25 1.25 0 0 0 12 7.5"
                        ></path>
                      </svg>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody className={"text-sm"}>
                        {prop.description.split("\n").map((p, idx) => {
                          if (p.startsWith("@link")) {
                            const link = p.substring(6);

                            return (
                              <p key={`p${idx}`}>
                                <a
                                  className={"text-link hover:text-link-hovered"}
                                  href={link}
                                  rel={"noreferrer"}
                                  target={"_blank"}
                                >
                                  {link}
                                </a>
                              </p>
                            );
                          }

                          return <p key={`p${idx}`}>{p.startsWith("@link") ? p : p}</p>;
                        })}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </span>
            </td>
            <td className={"block w-full md:table-cell md:w-auto md:p-2"}>
              <span className="mr-3 inline-block w-[5.5rem] bg-bg-subtle p-2 text-sm font-bold md:hidden">类型</span>
              {prop.type}
            </td>
            <td className={"block w-full whitespace-nowrap md:table-cell md:w-auto md:p-2 md:text-center"}>
              <span className="mr-3 inline-block w-[5.5rem] bg-bg-subtle p-2 text-sm font-bold md:hidden">默认值</span>
              {prop.defaultValue || "-"}
            </td>
            <td className={"block w-full whitespace-nowrap md:table-cell md:w-auto md:p-2 md:text-center"}>
              <span className="mr-3 inline-block w-[5.5rem] bg-bg-subtle p-2 text-sm font-bold md:hidden">必须</span>
              {prop.required ? "true" : "false"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ComponentExample = ({
  className,
  children,
}: {
  className?: string;
  children: (() => ReactNode) | ReactNode;
}) => {
  return (
    <div className={clsx("not-prose overflow-x-auto rounded-t border p-3 scrollbar scrollbar-thin", className)}>
      {isFunction(children) ? children() : children}
    </div>
  );
};
