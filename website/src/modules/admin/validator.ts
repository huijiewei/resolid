import { authLoginSchema } from "@resolid/framework/modules";
import { createResolver } from "@resolid/framework/utils";
import type { z } from "zod";

const adminLoginSchema = authLoginSchema;

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export const adminLoginResolver = createResolver(adminLoginSchema);
