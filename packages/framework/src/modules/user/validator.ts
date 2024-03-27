import { z } from "zod";
import { refineAuthCreateSchema } from "../../core/auth/validator";
import { zodLocaleResolver } from "../../utils/zod";

const emailValidator = z.string().min(1).max(100).email();

const userCreateSchema = refineAuthCreateSchema({
  email: emailValidator,
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;

export const userCreateResolver = zodLocaleResolver(userCreateSchema);

const userSignupSchema = refineAuthCreateSchema({
  email: emailValidator,
  agreeTerms: z.literal<boolean>(true),
});

export type UserSignupFormData = z.infer<typeof userSignupSchema>;

export const userSignupResolver = zodLocaleResolver(userSignupSchema);

const userLoginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

export type UserLoginFormData = z.infer<typeof userLoginSchema>;

export const userLoginResolver = zodLocaleResolver(userLoginSchema);
