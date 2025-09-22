import { authLoginSchema } from "@resolid/framework/modules";
import { createResolver, type z } from "@resolid/framework/utils";

export type AdminLoginFormData = z.infer<typeof authLoginSchema>;

export const adminLoginResolver = createResolver(authLoginSchema);
