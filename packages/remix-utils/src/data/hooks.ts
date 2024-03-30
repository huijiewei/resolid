import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useRouteLoaderData } from "@remix-run/react";

export const useTypedLoaderData = <T extends LoaderFunction>() => {
  return useLoaderData() as unknown as Awaited<ReturnType<T>>;
};

export const useTypedActionData = <T extends ActionFunction>() => {
  return useActionData() as unknown as Awaited<ReturnType<T>> | undefined;
};

export const useTypedRouteLoaderData = <T extends LoaderFunction>(routeId: string) => {
  return useRouteLoaderData(routeId) as unknown as Awaited<ReturnType<T>>;
};
