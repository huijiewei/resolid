import type { ComponentProp } from "@resolid/mdx-plugins";
import {
  Button,
  clsx,
  Input,
  NativeSelect,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@resolid/react-ui";
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
    return componentProps
      .filter((prop) => {
        return (
          prop.name != "asChild" &&
          prop.type != "Element" &&
          !/^on[A-Z]/.test(prop.name) &&
          !ignoreProps.includes(prop.name)
        );
      })
      .sort((a, b) => (a.control.length > b.control.length ? 1 : -1));
  }, [componentProps, ignoreProps]);

  const [state, setState] = useState<Record<string, string | boolean | number>>(
    filteredProps.reduce((obj, item) => {
      return {
        ...obj,
        [item["name"]]:
          item["defaultValue"] == "true" || item["defaultValue"] == "false"
            ? item["defaultValue"] == "true"
            : item["defaultValue"]
              ? item["defaultValue"].slice(1, -1)
              : undefined,
      };
    }, {}),
  );

  return (
    <div className={"not-prose flex min-h-28 w-full flex-col rounded border lg:flex-row"}>
      <div className={"flex flex-1 flex-col items-center justify-center p-5"}>{preview(state)}</div>
      <div className={"min-w-[15em] flex-shrink-0 border-t p-3 lg:border-s lg:border-t-0"}>
        <div className={"flex flex-col gap-3 text-sm"}>
          {filteredProps.map((prop) => {
            const propInputId = `prop-${prop.name}`;

            return (
              <div className={"flex items-center justify-between"} key={propInputId}>
                {prop.control == "boolean" && (
                  <Switch
                    size={"sm"}
                    checked={Boolean(state[prop.name])}
                    onChange={(value) => {
                      setState((prev) => ({ ...prev, [prop.name]: value }));
                    }}
                  >
                    {prop.description}
                  </Switch>
                )}
                {prop.control == "string" && (
                  <>
                    <label htmlFor={propInputId}>{prop.description}</label>
                    <Input
                      id={propInputId}
                      size={"xs"}
                      className={"w-1/2"}
                      value={state[prop.name] as string}
                      onChange={(value) => {
                        setState((prev) => ({ ...prev, [prop.name]: value }));
                      }}
                    />
                  </>
                )}
                {prop.control == "number" && (
                  <>
                    <label htmlFor={propInputId}>{prop.description}</label>
                    <input
                      id={propInputId}
                      type={"number"}
                      className={"w-1/2 rounded border p-1"}
                      value={String(state[prop.name])}
                      onChange={(e) => {
                        setState((prev) => ({ ...prev, [prop.name]: e.target.value }));
                      }}
                    />
                  </>
                )}
                {prop.control == "select" &&
                  (prop.name == "color" ? (
                    <>
                      <span>{prop.description}</span>
                      <div className={"inline-flex w-auto justify-between gap-1"}>
                        {prop.typeValues?.map((option) => {
                          const color = option.toString().slice(1, -1);

                          return (
                            <Button
                              square
                              padded={false}
                              className={"h-6"}
                              key={`${prop.name}-${color}`}
                              title={color}
                              color={color as never}
                              onClick={() => {
                                setState((prev) => ({ ...prev, [prop.name]: color }));
                              }}
                            >
                              {state[prop.name] == color && (
                                <svg
                                  height="1.25rem"
                                  width="1.25rem"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47"
                                  />
                                </svg>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor={propInputId}>{prop.description}</label>
                      <NativeSelect
                        id={propInputId}
                        size={"xs"}
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
                        {prop.typeValues?.map((item) => {
                          const option = item != "true" && item != "false" ? item.trim().slice(1, -1) : item;

                          return (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </>
                  ))}
              </div>
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
    <table className={"not-prose border-bd-subtle my-4 w-full table-auto border-separate rounded border text-sm"}>
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
              "md:flex-no-wrap border-b-bg-subtle mb-[1px] flex flex-row flex-wrap border-b pb-[1px] last:mb-0 last:border-none last:pb-0 md:mb-0 md:table-row md:border-none"
            }
            key={`${prop.name}-${i}`}
          >
            <td className={"block w-full whitespace-nowrap font-bold md:table-cell md:w-auto md:p-2"}>
              <span className="bg-bg-subtle mr-3 inline-block w-[5.5rem] p-2 text-sm font-bold md:hidden">属性</span>
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
                            const link = p.slice(6);

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
              <span className="bg-bg-subtle mr-3 inline-block w-[5.5rem] p-2 text-sm font-bold md:hidden">类型</span>
              {prop.type}
            </td>
            <td className={"block w-full whitespace-nowrap md:table-cell md:w-auto md:p-2 md:text-center"}>
              <span className="bg-bg-subtle mr-3 inline-block w-[5.5rem] p-2 text-sm font-bold md:hidden">默认值</span>
              {prop.defaultValue || "-"}
            </td>
            <td className={"block w-full whitespace-nowrap md:table-cell md:w-auto md:p-2 md:text-center"}>
              <span className="bg-bg-subtle mr-3 inline-block w-[5.5rem] p-2 text-sm font-bold md:hidden">必须</span>
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
    <div className={clsx("not-prose scrollbar scrollbar-thin overflow-x-auto rounded-t border p-3", className)}>
      {isFunction(children) ? children() : children}
    </div>
  );
};
