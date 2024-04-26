import { type AuthLoginFormData, authLoginResolver } from "@resolid/framework/modules";

export type AdminLoginFormData = AuthLoginFormData;

export const adminLoginResolver = authLoginResolver;
