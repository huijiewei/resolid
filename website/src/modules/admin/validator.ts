import { authLoginSchema } from "@resolid/framework/modules";
import { createResolver } from "@resolid/framework/utils";
import type * as z from "zod";

export type AdminLoginFormData = z.infer<typeof authLoginSchema>;

export const adminLoginResolver = createResolver(authLoginSchema);
