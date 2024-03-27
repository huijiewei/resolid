import { z } from "zod";
import { refineAuthCreateSchema, usernameValidator } from "../../core/auth/validator";
import { zodLocaleResolver } from "../../utils/zod";

const adminCreateSchema = refineAuthCreateSchema({});

export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;

export const adminCreateResolver = zodLocaleResolver(adminCreateSchema);

const adminLoginSchema = z.object({
  username: usernameValidator,
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export const adminLoginResolver = zodLocaleResolver(adminLoginSchema);
