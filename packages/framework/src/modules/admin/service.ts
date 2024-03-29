import { eq } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { adminGroupTable, adminTable } from "./schema";

export { adminGroupTable, adminTable };

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { adminGroup: AdminGroupSelect };
export type AdminInsert = typeof adminTable.$inferInsert;

export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminGroupInsert = typeof adminGroupTable.$inferInsert;

type WithInput = NonNullable<Parameters<(typeof db)["query"]["adminTable"]["findFirst"]>[0]>["with"];

export const adminService = {
  _getByField: async <R extends AdminSelect | AdminSelectWithGroup>(
    field: keyof AdminSelect,
    value: string | number,
    withInput?: WithInput,
  ): Promise<R | undefined> => {
    return (await db.query.adminTable.findFirst({
      where: eq(adminTable[field], value),
      with: withInput,
    })) as R;
  },

  getById: async (id: number): Promise<AdminSelectWithGroup | undefined> => {
    return adminService._getByField("id", id, { adminGroup: true });
  },
  getByUsername: async (username: string): Promise<AdminSelectWithGroup | undefined> => {
    return adminService._getByField("username", username, { adminGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await adminService._getByField("username", username)) != undefined;
  },
  getByNickname: async (nickname: string): Promise<AdminSelectWithGroup | undefined> => {
    return adminService._getByField("nickname", nickname, { adminGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await adminService._getByField("nickname", nickname)) != undefined;
  },
  getAdminGroups: (): Promise<AdminGroupSelect[]> => {
    return db.query.adminGroupTable.findMany();
  },
  createAdminGroup: async (adminGroup: AdminGroupInsert) => {
    const inserted = await db.insert(adminGroupTable).values(adminGroup).returning();

    return inserted[0] as AdminGroupSelect;
  },
  createAdmin: async (admin: AdminInsert) => {
    const inserted = await db.insert(adminTable).values(admin).returning();

    return inserted[0] as AdminSelect;
  },
};
