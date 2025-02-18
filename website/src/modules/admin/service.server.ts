import { createAuthLoginService, createAuthSessionService } from "@resolid/framework/modules.server";
import { db } from "~/foundation/db.server";
import {
  type AdminSelectWithGroup,
  adminGroupTable,
  adminSessionTable,
  adminTable,
} from "~/modules/admin/schema.server";
import { type AdminLoginFormData, adminLoginResolver } from "~/modules/admin/validator";

export const adminLoginService = createAuthLoginService<AdminLoginFormData, AdminSelectWithGroup>(
  db,
  adminTable,
  adminGroupTable,
  adminLoginResolver,
);

export const adminSessionService = createAuthSessionService<AdminSelectWithGroup>(
  db,
  adminTable,
  adminGroupTable,
  adminSessionTable,
);
