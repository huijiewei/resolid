import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaArgs,
  MetaDescriptor,
} from "@remix-run/node";
import { type UNSAFE_MetaMatch, useActionData, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import type { ResponseStub, Serialize } from "@remix-run/server-runtime/dist/single-fetch";

interface MetaMatch_SingleFetch<RouteId extends string = string, L extends TypedLoader | unknown = unknown>
  extends Omit<UNSAFE_MetaMatch<RouteId, L>, "data"> {
  data: L extends TypedLoader ? Serialize<L> : unknown;
}

type MetaMatches_SingleFetch<MatchLoaders extends Record<string, TypedLoader | unknown> = Record<string, unknown>> =
  Array<
    {
      [K in keyof MatchLoaders]: MetaMatch_SingleFetch<Exclude<K, number | symbol>, MatchLoaders[K]>;
    }[keyof MatchLoaders]
  >;

export interface MetaArgs_SingleFetch<
  L extends TypedLoader | unknown = unknown,
  MatchLoaders extends Record<string, TypedLoader | unknown> = Record<string, unknown>,
> extends Omit<MetaArgs<L, MatchLoaders>, "data" | "matches"> {
  data: (L extends TypedLoader ? Serialize<L> : unknown) | undefined;
  matches: MetaMatches_SingleFetch<MatchLoaders>;
}

type TypedMetaFunction<
  L extends TypedLoader | unknown = unknown,
  MatchLoaders extends Record<string, TypedLoader | unknown> = Record<string, unknown>,
> = (args: MetaArgs_SingleFetch<L, MatchLoaders>) => MetaDescriptor[];

export const mergeMeta = <
  L extends TypedLoader | unknown = unknown,
  MatchLoaders extends Record<string, L | unknown> = Record<string, unknown>,
>(
  metaFn: TypedMetaFunction<L, MatchLoaders>,
  titleJoin = " - ",
): TypedMetaFunction<L, MatchLoaders> => {
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

export type { ResponseStub };

export type TypedActionArgs = ActionFunctionArgs & {
  response: ResponseStub;
};

export type TypedAction = (args: TypedActionArgs) => ReturnType<ActionFunction>;

export type TypedLoaderArgs = LoaderFunctionArgs & {
  response: ResponseStub;
};

export type TypedLoader = (args: TypedLoaderArgs) => ReturnType<LoaderFunction>;

export const useTypedLoaderData = <T extends TypedLoader>() => {
  return useLoaderData() as unknown as Awaited<ReturnType<T>>;
};

export const useTypedActionData = <T extends TypedAction>() => {
  return useActionData() as unknown as Awaited<ReturnType<T>> | undefined;
};

export const useTypedRouteLoaderData = <T extends TypedLoader>(routeId: string) => {
  return useRouteLoaderData(routeId) as unknown as Awaited<ReturnType<T>>;
};
