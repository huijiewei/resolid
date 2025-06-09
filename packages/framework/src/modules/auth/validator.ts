import { z } from "zod/v4";

export const usernameValidator = z
  .string()
  .min(4)
  .max(32)
  .regex(/^[a-z][a-z0-9_\\.]*$/)
  .refine(
    (value) =>
      ![
        "admin",
        "administrator",
        "hostmaster",
        "webmaster",
        "postmaster",
        "demo",
        "root",
        "null",
        "undefined",
        "abuse",
        "guest",
        "user",
        "username",
        "account",
        "resolid",
      ].includes(value),
    {
      error: "用户名为保留字",
    },
  );

export const emailValidator = z.email().min(1).max(100);

export const passwordValidator = z.string().min(6).max(32);

export const passwordConfirmCheck: z.core.CheckFn<{
  password: string;
  confirmPassword: string;
}> = (ctx) => {
  if (ctx.value.password != ctx.value.confirmPassword) {
    ctx.issues.push({
      code: "custom",
      input: ctx.value,
      message: "密码与确认密码必须相同",
      path: ["confirmPassword"],
    });
  }
};

export const authSignupSchema = z.object({
  email: emailValidator,
  username: usernameValidator,
  nickname: z.string().max(32).optional(),
  password: passwordValidator,
  confirmPassword: passwordValidator,
});

export type AuthSignupFormData = z.infer<typeof authSignupSchema>;

export const authLoginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1),
  rememberMe: z.boolean(),
});

export type AuthLoginFormData = z.infer<typeof authLoginSchema>;

export const authPasswordForgotSchema = z.object({
  email: emailValidator,
  token: z.string().min(1),
});

export type AuthPasswordForgotFormData = z.infer<typeof authPasswordForgotSchema>;

export const authPasswordResetSchema = z
  .object({
    password: passwordValidator,
    confirmPassword: passwordValidator,
    token: z.string().optional(),
  })
  .check(passwordConfirmCheck);

export type AuthPasswordResetFormData = z.infer<typeof authPasswordResetSchema>;
