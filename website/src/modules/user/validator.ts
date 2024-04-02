import { zodLocaleResolver } from "@resolid/framework/utils";
import { z } from "zod";

const userPasswordForgotSchema = z.object({
  email: z.string().min(1).email(),
  token: z.string().min(1),
});

export type UserPasswordForgotFormData = z.infer<typeof userPasswordForgotSchema>;

export const userPasswordForgotResolver = zodLocaleResolver(userPasswordForgotSchema);

const userPasswordResetSchema = z
  .object({
    password: z.string().min(6).max(32),
    confirmPassword: z.string().min(6).max(32),
    token: z.string().optional(),
  })
  .refine((value) => value.password == value.confirmPassword, {
    message: "密码与确认密码必须相同",
    path: ["confirmPassword"],
  });

export type UserPasswordResetFormData = z.infer<typeof userPasswordResetSchema>;

export const userPasswordResetResolver = zodLocaleResolver(userPasswordResetSchema);
