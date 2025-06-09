import {
  authLoginSchema,
  authPasswordForgotSchema,
  authPasswordResetSchema,
  authSignupSchema,
  passwordConfirmCheck,
} from "@resolid/framework/modules";
import { createResolver } from "@resolid/framework/utils";
import { z } from "zod/v4";

export type UserLoginFormData = z.infer<typeof authLoginSchema>;

export const userLoginResolver = createResolver(authLoginSchema);

const userSignupSchema = authSignupSchema
  .extend({
    agreeTerms: z.literal<boolean>(true),
    rememberMe: z.boolean(),
    createdIp: z.string().optional(),
    createdFrom: z.string().optional(),
  })
  .check(passwordConfirmCheck);

export type UserSignupFormData = z.infer<typeof userSignupSchema>;

export const userSignupResolver = createResolver(userSignupSchema);

export type UserPasswordForgotFormData = z.infer<typeof authPasswordForgotSchema>;

export const userPasswordForgotResolver = createResolver(authPasswordForgotSchema);

export type UserPasswordResetFormData = z.infer<typeof authPasswordResetSchema>;

export const userPasswordResetResolver = createResolver(authPasswordResetSchema);
