import { json } from "@remix-run/server-runtime";
import type { FieldErrors } from "react-hook-form";

export const problem = (errors: FieldErrors | Record<string, { message: string } | null | undefined>) => {
  return json(
    {
      success: false,
      errors,
    },
    { status: 422 },
  );
};

export const success = <T extends object>(data: T | null, init: number | ResponseInit = {}) => {
  return json(
    {
      success: true,
      data,
    },
    init,
  );
};

export const unauthorized = () => {
  return new Response(null, { status: 401 });
};
