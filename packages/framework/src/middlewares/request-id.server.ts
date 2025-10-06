import { createContext, type MiddlewareFunction, type RouterContextProvider } from "react-router";
import { randomString } from "../utils/random";

export type CreateRequestIdMiddlewareOptions = {
  /**
   * The name of the header to read the requestId from.
   *
   * @default "X-Request-Id"
   */
  header?: string;

  /**
   * The length of the requestId.
   *
   * @default 255
   */
  limitLength?: number;

  /**
   * A function to generate a requestId.
   *
   * @default () => randomString()
   */
  generator?: () => string;
};

export const createRequestIdMiddleware = ({
  generator = () => randomString(),
  header = "X-Request-Id",
  limitLength = 255,
}: CreateRequestIdMiddlewareOptions = {}): [
  MiddlewareFunction<Response>,
  (context: Readonly<RouterContextProvider>) => string,
] => {
  const requestIdContext = createContext<string>();

  return [
    ({ request, context }) => {
      let requestId = request.headers.get(header);

      if (!requestId || requestId.length > limitLength || /[^\w-]/.test(requestId)) {
        requestId = generator();
      }

      context.set(requestIdContext, requestId);
    },
    (context) => context.get(requestIdContext),
  ];
};
