import type { ResponseStub } from "@remix-run/server-runtime/dist/single-fetch";
import type { FieldErrors } from "react-hook-form";

export const httpNotFound = (message = "页面未找到") => {
  throw new Response(message, { status: 404 });
};

export const httpProblem = (response: ResponseStub, errors: FieldErrors) => {
  response.status = 422;

  return { errors };
};

export const httpRedirect = (response: ResponseStub, url: string, cookie: string | null = null, status = 302) => {
  response.status = status;
  response.headers.set("Location", url);

  if (cookie) {
    response.headers.set("Set-Cookie", cookie);
  }

  throw response;
};
