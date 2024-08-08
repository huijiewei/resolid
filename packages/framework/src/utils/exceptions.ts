import { unstable_data } from "@remix-run/node";
import type {
  BrowserNativeObject,
  DeepRequired,
  FieldError,
  FieldErrors,
  FieldValues,
  GlobalError,
  IsAny,
  Merge,
} from "react-hook-form";

type FieldErrorNoRef = FieldError & {
  root?: FieldErrorNoRef;
  ref?: undefined;
};

type FieldErrorsNoRefImpl<T extends FieldValues = FieldValues> = {
  [K in keyof T]?: T[K] extends BrowserNativeObject | Blob
    ? FieldErrorNoRef
    : K extends "root" | `root.${string}`
      ? GlobalError
      : T[K] extends object
        ? Merge<FieldErrorNoRef, FieldErrorsNoRefImpl<T[K]>>
        : FieldErrorNoRef;
};

type FieldErrorsNoRef<T extends FieldValues = FieldValues> = Partial<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  FieldValues extends IsAny<FieldValues> ? any : FieldErrorsNoRefImpl<DeepRequired<T>>
> & {
  root?: Record<string, GlobalError> & GlobalError;
};

export const httpProblem = (errors: FieldErrors) => {
  return unstable_data({ errors: errors as FieldErrorsNoRef }, 422);
};

export const httpNotFound = (message = "页面未找到") => {
  throw new Response(message, { status: 404 });
};

export const httpRedirect = (url: string, cookie: string | null = null, status = 302) => {
  const headers = new Headers();
  headers.set("Location", url);

  if (cookie) {
    headers.set("Set-Cookie", cookie);
  }

  throw new Response(null, {
    status,
    headers,
  });
};
