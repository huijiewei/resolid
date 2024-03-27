import { count, eq } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { adminGroupTable, adminTable } from "./schema";

export { adminGroupTable, adminTable };

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { adminGroup: AdminGroupSelect };
export type AdminInsert = typeof adminTable.$inferInsert;

export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminGroupInsert = typeof adminGroupTable.$inferInsert;

export const adminService = {
  getById: async (id: number): Promise<AdminSelectWithGroup | null> => {
    const admins = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.id, id))
      .leftJoin(adminGroupTable, eq(adminTable.adminGroupId, adminGroupTable.id))
      .limit(1);

    if (admins.length == 0) {
      return null;
    }

    const { admin, admin_group } = admins[0];

    return { ...admin, adminGroup: admin_group } as AdminSelectWithGroup;
  },
  getByUsername: async (username: string): Promise<AdminSelectWithGroup | null> => {
    const admins = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.username, username))
      .leftJoin(adminGroupTable, eq(adminTable.adminGroupId, adminGroupTable.id))
      .limit(1);

    if (admins.length == 0) {
      return null;
    }

    const { admin, admin_group } = admins[0];

    return { ...admin, adminGroup: admin_group } as AdminSelectWithGroup;
  },
  existByUsername: async (username: string) => {
    return (await db.select({ value: count() }).from(adminTable).where(eq(adminTable.username, username)))[0].value > 0;
  },
  getByNickname: async (nickname: string): Promise<AdminSelectWithGroup | null> => {
    const admins = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.nickname, nickname))
      .leftJoin(adminGroupTable, eq(adminTable.adminGroupId, adminGroupTable.id))
      .limit(1);

    if (admins.length == 0) {
      return null;
    }

    const { admin, admin_group } = admins[0];

    return { ...admin, adminGroup: admin_group } as AdminSelectWithGroup;
  },
  existByNickname: async (nickname: string) => {
    return (await db.select({ value: count() }).from(adminTable).where(eq(adminTable.nickname, nickname)))[0].value > 0;
  },
  getAdminGroups: (): Promise<AdminGroupSelect[]> => {
    return db.select().from(adminGroupTable);
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
