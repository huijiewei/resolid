import type { MetaDescriptor } from "@remix-run/node";
import type { MetaArgs_SingleFetch } from "@remix-run/react";
import type { unstable_Loader as Loader } from "@remix-run/server-runtime";

export const mergeMeta = <
  L extends Loader | unknown = unknown,
  MatchLoaders extends Record<string, Loader | unknown> = Record<string, unknown>,
>(
  metaFn: (arg: MetaArgs_SingleFetch<L, MatchLoaders>) => MetaDescriptor[],
  titleJoin = " - ",
): ((arg: MetaArgs_SingleFetch<L, MatchLoaders>) => MetaDescriptor[]) => {
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

export type SuccessData = { success: true } | undefined;

export const isSuccess = (data: SuccessData): boolean => {
  return !!data?.success;
};
