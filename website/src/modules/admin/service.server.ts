import { createAuthLoginService, createAuthSessionService } from "@resolid/framework/modules.server";
import { db } from "~/foundation/db.server";
import {
  type AdminSelectWithGroup,
  adminGroupTable,
  adminSessionTable,
  adminTable,
} from "~/modules/admin/schema.server";

export const adminLoginService = createAuthLoginService<AdminSelectWithGroup>(db, adminTable, adminGroupTable);

export const adminSessionService = createAuthSessionService<AdminSelectWithGroup>(
  db,
  adminTable,
  adminGroupTable,
  adminSessionTable,
);
