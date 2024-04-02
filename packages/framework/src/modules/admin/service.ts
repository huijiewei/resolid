import { hash } from "@node-rs/bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { FieldException } from "../../utils/exceptions";
import { validateData } from "../../utils/zod";
import { adminGroupTable, adminTable } from "./schema";
import { adminCreateResolver, type AdminCreateFormData } from "./validator";

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { adminGroup: AdminGroupSelect };
export type AdminInsert = typeof adminTable.$inferInsert & { adminGroupId: number };

export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminGroupInsert = typeof adminGroupTable.$inferInsert;

type WithInput = NonNullable<Parameters<(typeof db)["query"]["adminTable"]["findFirst"]>[0]>["with"];
type ColumnsInput = NonNullable<Parameters<(typeof db)["query"]["adminTable"]["findFirst"]>[0]>["columns"];

const getAdminByField = async <R extends AdminSelect | AdminSelectWithGroup>(
  field: keyof AdminSelect,
  value: string | number,
  columns?: ColumnsInput,
  withInput?: WithInput,
): Promise<R | undefined> => {
  return (await db.query.adminTable.findFirst({
    columns,
    where: eq(adminTable[field], value),
    with: withInput,
  })) as R;
};

const insertAdmin = async (admin: AdminInsert) => {
  if (admin.username && (await adminService.existByUsername(admin.username))) {
    throw new FieldException("username", "用户名已存在");
  }

  if (admin.nickname && (await adminService.existByUsername(admin.nickname))) {
    throw new FieldException("username", "昵称已存在");
  }

  const adminGroup = await adminService.getAdminGroupById(admin.adminGroupId);

  if (!adminGroup) {
    throw new FieldException("adminGroupId", "管理组不存在");
  }

  admin.password = await hash(admin.password!);

  const inserted = await db.insert(adminTable).values(admin).returning();

  return { ...inserted[0], adminGroup };
};

export const adminService = {
  getById: async (id: number): Promise<AdminSelectWithGroup | undefined> => {
    return getAdminByField("id", id, undefined, { adminGroup: true });
  },
  getByUsername: async (username: string): Promise<AdminSelectWithGroup | undefined> => {
    return getAdminByField("username", username, undefined, { adminGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await getAdminByField("username", username, { username: true })) != undefined;
  },
  getByNickname: async (nickname: string): Promise<AdminSelectWithGroup | undefined> => {
    return getAdminByField("nickname", nickname, undefined, { adminGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await getAdminByField("nickname", nickname, { nickname: true })) != undefined;
  },
  getAdminGroups: async (): Promise<AdminGroupSelect[]> => {
    return db.query.adminGroupTable.findMany();
  },
  getAdminGroupById: async (id: number) => {
    return db.query.adminGroupTable.findFirst({
      where: eq(adminGroupTable.id, id),
    });
  },
  createAdminGroup: async (adminGroup: AdminGroupInsert) => {
    const inserted = await db.insert(adminGroupTable).values(adminGroup).returning();

    return inserted[0] as AdminGroupSelect;
  },
  createAdmin: async (data: AdminCreateFormData) => {
    const { errors, values } = await validateData(data, adminCreateResolver);

    if (errors) {
      return [errors, undefined];
    }

    try {
      const admin = await insertAdmin(values);

      return [undefined, admin];
    } catch (e) {
      return [(e as FieldException).toFieldErrors(), undefined];
    }
  },
};
