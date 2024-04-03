import type { FieldError } from "react-hook-form";

export class FieldException extends Error {
  public readonly field: string;

  constructor(field: string, message: string) {
    super(message);

    this.field = field;
    this.name = "FieldException";
  }

  toFieldErrors() {
    const fieldErrors: Record<string, FieldError> = {};

    fieldErrors[this.field] = { type: "custom", message: this.message };

    return fieldErrors;
  }
}