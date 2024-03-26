import { z } from "zod";
import { refineAuthCreateValidationSchema, usernameValidation } from "../../core/auth/validation";
import { zodLocaleResolver } from "../../utils/zod";

const adminCreateValidationSchema = refineAuthCreateValidationSchema({});

export type AdminCreateFormData = z.infer<typeof adminCreateValidationSchema>;

export const adminCreateResolver = zodLocaleResolver(adminCreateValidationSchema);

const adminLoginValidationSchema = z.object({
  username: usernameValidation,
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

export type AdminLoginFormData = z.infer<typeof adminLoginValidationSchema>;

export const adminLoginResolver = zodLocaleResolver(adminLoginValidationSchema);
