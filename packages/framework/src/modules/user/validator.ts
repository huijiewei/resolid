import { z } from "zod";
import { authBaseRawShape, emailValidator, isEqualPasswordAndConfirm } from "../../core/auth/validator";
import { zodLocaleResolver } from "../../utils/zod";

const userCreateSchema = z
  .object({ ...authBaseRawShape, email: emailValidator })
  .superRefine(isEqualPasswordAndConfirm);

export type UserCreateFormData = z.infer<typeof userCreateSchema>;

export const userCreateResolver = zodLocaleResolver(userCreateSchema);

const userSignupSchema = z
  .object({ ...authBaseRawShape, email: emailValidator, agreeTerms: z.literal<boolean>(true) })
  .superRefine(isEqualPasswordAndConfirm);

export type UserSignupFormData = z.infer<typeof userSignupSchema>;

export const userSignupResolver = zodLocaleResolver(userSignupSchema);

const userLoginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

export type UserLoginFormData = z.infer<typeof userLoginSchema>;

export const userLoginResolver = zodLocaleResolver(userLoginSchema);
