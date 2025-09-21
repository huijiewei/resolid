import { createContext, type MiddlewareFunction, type RouterContextProvider } from "react-router";

export type CreateTimezoneMiddlewareOptions = {
  cookieName: string;
  fallback?: string;
};

export const createTimezoneMiddleware = ({
  cookieName,
  fallback = "UTC",
}: CreateTimezoneMiddlewareOptions): [
  MiddlewareFunction<Response>,
  (context: Readonly<RouterContextProvider>) => string,
] => {
  const timezoneContext = createContext<string>();

  return [
    ({ request, context }, next) => {
      const timezone =
        request.headers
          .get("Cookie")
          ?.split(";")
          .find((c) => c.trim().startsWith(`${cookieName}=`))
          ?.split("=")[1] ?? fallback;

      context.set(timezoneContext, decodeURIComponent(timezone));

      return next();
    },
    (context) => context.get(timezoneContext),
  ];
};
