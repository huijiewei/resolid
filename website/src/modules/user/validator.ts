import {
  authLoginSchema,
  authPasswordForgotSchema,
  authPasswordResetSchema,
  authSignupSchema,
  passwordConfirmRefinement,
} from "@resolid/framework/modules";
import { createResolver } from "@resolid/framework/utils";
import { z } from "zod";

export type UserLoginFormData = z.infer<typeof authLoginSchema>;

export const userLoginResolver = createResolver<UserLoginFormData>(authLoginSchema);

const userSignupSchema = authSignupSchema
  .extend({
    agreeTerms: z.literal<boolean>(true),
    rememberMe: z.boolean().default(false),
    createdIp: z.string().optional(),
    createdFrom: z.string().optional(),
  })
  .superRefine(passwordConfirmRefinement);

export type UserSignupFormData = z.infer<typeof userSignupSchema>;

export const userSignupResolver = createResolver<UserSignupFormData>(userSignupSchema);

export type UserPasswordForgotFormData = z.infer<typeof authPasswordForgotSchema>;

export const userPasswordForgotResolver = createResolver<UserPasswordForgotFormData>(authPasswordForgotSchema);

export type UserPasswordResetFormData = z.infer<typeof authPasswordResetSchema>;

export const userPasswordResetResolver = createResolver<UserPasswordResetFormData>(authPasswordResetSchema);
