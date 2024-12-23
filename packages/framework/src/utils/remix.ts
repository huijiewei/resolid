import type { MetaDescriptor } from "react-router";

type MetaArgs = {
  matches: Array<
    { pathname: string; meta: MetaDescriptor[]; data: unknown; handle?: unknown; error?: unknown } | undefined
  >;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeMeta = (metaFn: (arg: any) => MetaDescriptor[], titleJoin = " - ") => {
  return (arg: MetaArgs) => {
    const leafMeta = metaFn(arg);

    const mergedMeta = arg.matches.reduceRight((acc, match) => {
      if (match) {
        for (const parentMeta of match.meta) {
          const index = acc.findIndex((meta) => {
            if ("name" in meta && "name" in parentMeta) {
              return meta.name === parentMeta.name;
            }

            if ("property" in meta && "property" in parentMeta) {
              return meta.property === parentMeta.property;
            }

            if ("title" in meta && "title" in parentMeta) {
              return meta.title === parentMeta.title;
            }

            return false;
          });

          if (index == -1) {
            acc.push(parentMeta);
          }
        }
      }

      return acc;
    }, leafMeta);

    const titles: string[] = [];
    const result: MetaDescriptor[] = [];

    for (const meta of mergedMeta) {
      if ("title" in meta) {
        if (typeof meta.title === "string" && meta.title.length > 0) {
          titles.push(...meta.title.split(titleJoin));
        }
      } else {
        result.push(meta);
      }
    }

    result.unshift({ title: [...new Set(titles)].join(titleJoin) });

    return result;
  };
};

export type SuccessData = { success: boolean } | undefined;

export const isSuccess = (data: unknown): boolean => {
  return !!(data as SuccessData)?.success;
};
