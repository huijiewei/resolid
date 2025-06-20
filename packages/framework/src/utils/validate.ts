import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zhCN } from "zod/v4/locales";

z.config(zhCN());

export const createResolver = zodResolver;

export type ValidateDataResult<T extends FieldValues> =
  | { success: true; values: T }
  | { success: false; errors: FieldErrors<T> };

export const validateData = async <T extends FieldValues>(
  data: T,
  resolver: Resolver<T>,
): Promise<ValidateDataResult<T>> => {
  const { errors, values } = await resolver(data, {}, { shouldUseNativeValidation: false, fields: {} });

  if (Object.keys(errors).length > 0) {
    return { success: false, errors: errors as FieldErrors<T> };
  }

  return { success: true, values: values as T };
};

export const createFieldErrors = <T extends FieldValues = FieldValues>(errors: Record<string, string>) => {
  const fieldErrors: FieldErrors = {};

  for (const error in errors) {
    fieldErrors[error] = {
      type: "custom",
      message: errors[error],
    };
  }

  return fieldErrors as unknown as FieldErrors<T>;
};
