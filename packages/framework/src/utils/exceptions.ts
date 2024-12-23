import type { FieldErrors } from "react-hook-form";
import { data } from "react-router";

export const httpProblem = (errors: FieldErrors) => {
  return data({ errors: errors }, 422);
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
