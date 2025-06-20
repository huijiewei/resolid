import { authLoginSchema } from "@resolid/framework/modules";
import { createResolver } from "@resolid/framework/utils";
import type { z } from "zod/v4";

export type AdminLoginFormData = z.infer<typeof authLoginSchema>;

export const adminLoginResolver = createResolver(authLoginSchema);
