import { z } from "zod";
import { refineAuthCreateValidationSchema } from "../../core/auth/validation";
import { zodLocaleResolver } from "../../utils/zod";

const emailValidation = z.string().min(1).max(100).email();

export const userCreateValidationSchema = refineAuthCreateValidationSchema({
  email: emailValidation,
});

export type UserCreateFormData = z.infer<typeof userCreateValidationSchema>;

export const userCreateResolver = zodLocaleResolver(userCreateValidationSchema);

export const userSignupValidationSchema = refineAuthCreateValidationSchema({
  email: emailValidation,
  agreeTerms: z.literal<boolean>(true),
});

export type UserSignupFormData = z.infer<typeof userSignupValidationSchema>;

export const userSignupResolver = zodLocaleResolver(userSignupValidationSchema);

const userLoginValidationSchema = z.object({
  email: emailValidation,
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

export type UserLoginFormData = z.infer<typeof userLoginValidationSchema>;

export const userLoginResolver = zodLocaleResolver(userLoginValidationSchema);
