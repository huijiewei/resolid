import { beforeAll, describe, expect, test } from "vitest";
import { db } from "../../foundation/alias";
import { adminGroupTable, adminTable } from "./schema";
import { adminService } from "./service";

describe("adminService", () => {
  beforeAll(async () => {
    await db.delete(adminTable);
    await db.delete(adminGroupTable);

    await db.insert(adminGroupTable).values({ id: 1, name: "test" });
    await db.insert(adminTable).values({ id: 1, adminGroupId: 1, username: "test", nickname: "Test" });
  });

  test("getByUsername", async () => {
    const user = await adminService.getByUsername("test2");

    expect(user).toBe(null);
  });

  test("existByUsername", async () => {
    const exist = await adminService.existByUsername("test2");

    expect(exist).toBe(false);
  });

  test("getByNickname", async () => {
    const user = await adminService.getByNickname("Test");

    expect(user?.username).toBe("test");
  });

  test("getAdminGroups", async () => {
    const groups = await adminService.getAdminGroups();

    expect(groups[0].name).toBe("test");
  });
});
