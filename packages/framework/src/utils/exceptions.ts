import type { FieldErrors } from "react-hook-form";

type ResponseStub = {
  status: number | undefined;
  headers: Headers;
};

export const httpNotFound = (message = "页面未找到") => {
  throw new Response(message, { status: 404 });
};

export const httpProblem = (response: ResponseStub, errors: FieldErrors) => {
  response.status = 422;

  return { errors };
};
