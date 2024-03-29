import type { FieldErrors, FieldValues } from "react-hook-form";

export type ServiceResult<T extends FieldValues, R> = [FieldErrors<T>, undefined] | [undefined, R];
