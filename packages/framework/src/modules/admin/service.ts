import { eq, sql } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { adminGroupTable, adminTable } from "./schema";

export { adminGroupTable, adminTable };

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { adminGroup: AdminGroupSelect };
export type AdminInsert = typeof adminTable.$inferInsert;

export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminGroupInsert = typeof adminGroupTable.$inferInsert;

export const adminService = {
  getByField: async <T, R extends AdminSelect | AdminSelectWithGroup>(
    field: keyof AdminSelect,
    value: T,
    withRelation?: {
      adminGroup?: true;
    },
  ): Promise<R | null> => {
    const prepared = db.query.adminTable
      .findFirst({
        where: eq(adminTable[field], sql.placeholder("value")),
        with: withRelation,
      })
      .prepare(`getUserByField_${field}`);

    const record = await prepared.execute({ value });

    return (record as R) ?? null;
  },
  getById: async (id: number): Promise<AdminSelectWithGroup | null> => {
    return await adminService.getByField("id", id, { adminGroup: true });
  },
  getByUsername: async (username: string): Promise<AdminSelectWithGroup | null> => {
    return await adminService.getByField("username", username, { adminGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await adminService.getByField("username", username)) != null;
  },
  getByNickname: async (nickname: string): Promise<AdminSelectWithGroup | null> => {
    return await adminService.getByField("nickname", nickname, { adminGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await adminService.getByField("nickname", nickname)) != null;
  },
  getAdminGroups: (): Promise<AdminGroupSelect[]> => {
    return db.query.adminGroupTable.findMany();
  },
};
