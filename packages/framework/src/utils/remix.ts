import type { ActionFunction, LoaderFunction, MetaDescriptor, MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useRouteLoaderData } from "@remix-run/react";

export const mergeMeta = <
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction | unknown> = Record<string, unknown>,
>(
  metaFn: MetaFunction<Loader, ParentsLoaders>,
  titleJoin: string = " - ",
): MetaFunction<Loader, ParentsLoaders> => {
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

export const useTypedLoaderData = <T extends LoaderFunction>() => {
  return useLoaderData() as unknown as Awaited<ReturnType<T>>;
};

export const useTypedActionData = <T extends ActionFunction>() => {
  return useActionData() as unknown as Awaited<ReturnType<T>> | undefined;
};

export const useTypedRouteLoaderData = <T extends LoaderFunction>(routeId: string) => {
  return useRouteLoaderData(routeId) as unknown as Awaited<ReturnType<T>>;
};
