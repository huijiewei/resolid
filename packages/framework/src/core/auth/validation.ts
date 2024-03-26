import { z, type ZodRawShape } from "zod";

export const usernameValidation = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[a-z][a-z0-9_\\.]*$/);

export const refineAuthCreateValidationSchema = (schema: ZodRawShape) => {
  return z
    .object({
      username: usernameValidation,
      nickname: z.string().max(32).optional(),
      password: z.string().min(6).max(32),
      confirmPassword: z.string().min(6).max(32),
    })
    .extend(schema)
    .refine((data) => data.password == data.confirmPassword, {
      path: ["confirmPassword"],
      message: "密码与确认密码必须相同",
    });
};
