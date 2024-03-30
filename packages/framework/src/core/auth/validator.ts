import { z } from "zod";

export const usernameValidator = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[a-z][a-z0-9_\\.]*$/);

export const emailValidator = z.string().min(1).max(100).email();

export const authBaseRawShape = {
  username: usernameValidator,
  nickname: z.string().max(32).optional(),
  password: z.string().min(6).max(32),
  confirmPassword: z.string().min(6).max(32),
};

export const isEqualPasswordAndConfirm: z.RefinementEffect<{
  password: string;
  confirmPassword: string;
}>["refinement"] = (value, ctx) => {
  if (value.password != value.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "密码与确认密码必须相同",
      path: ["confirmPassword"],
    });
  }
};
