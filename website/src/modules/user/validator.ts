import {
  authLoginResolver,
  authPasswordForgotResolver,
  authPasswordResetResolver,
  authSignupSchema,
  isEqualPasswordAndConfirm,
  type AuthLoginFormData,
  type AuthPasswordForgotFormData,
  type AuthPasswordResetFormData,
} from "@resolid/framework/modules";
import { zodLocaleResolver } from "@resolid/framework/utils";
import { z } from "zod";

export type UserLoginFormData = AuthLoginFormData;

export const userLoginResolver = authLoginResolver;

const userSignupSchema = authSignupSchema
  .extend({
    agreeTerms: z.literal<boolean>(true),
    rememberMe: z.boolean().default(false),
    createdIp: z.string().optional(),
    createdFrom: z.string().optional(),
  })
  .superRefine(isEqualPasswordAndConfirm);

export type UserSignupFormData = z.infer<typeof userSignupSchema>;

export const userSignupResolver = zodLocaleResolver(userSignupSchema);

export type UserPasswordForgotFormData = AuthPasswordForgotFormData;

export const userPasswordForgotResolver = authPasswordForgotResolver;

export type UserPasswordResetFormData = AuthPasswordResetFormData;

export const userPasswordResetResolver = authPasswordResetResolver;
