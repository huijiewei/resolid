import { authLoginResolver, type AuthLoginFormData } from "@resolid/framework/modules";

export type AdminLoginFormData = AuthLoginFormData;

export const adminLoginResolver = authLoginResolver;
