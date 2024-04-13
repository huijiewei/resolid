import { createAuthLoginService, createAuthSessionService } from "@resolid/framework/modules";
import { db } from "~/foundation/db.server";
import {
  adminGroupTable,
  adminSessionTable,
  adminTable,
  type AdminSelectWithGroup,
} from "~/modules/admin/schema.server";

export const adminLoginService = createAuthLoginService<AdminSelectWithGroup>(db, adminTable, adminGroupTable);

export const adminSessionService = createAuthSessionService<AdminSelectWithGroup>(
  db,
  adminTable,
  adminGroupTable,
  adminSessionTable,
);
