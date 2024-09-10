import type { LoaderFunction, MetaDescriptor } from "@remix-run/node";
import type { MetaArgs } from "@remix-run/react";

export const mergeMeta = <
  L extends LoaderFunction | unknown = unknown,
  MatchLoaders extends Record<string, LoaderFunction | unknown> = Record<string, unknown>,
>(
  metaFn: (arg: MetaArgs<L, MatchLoaders>) => MetaDescriptor[],
  titleJoin = " - ",
): ((arg: MetaArgs<L, MatchLoaders>) => MetaDescriptor[]) => {
  return (arg) => {
    const leafMeta = metaFn(arg);

    const mergedMeta = arg.matches.reduceRight((acc, match) => {
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
