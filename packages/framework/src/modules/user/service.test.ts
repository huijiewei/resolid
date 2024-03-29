import { beforeAll, describe, expect, test } from "vitest";
import { db } from "../../foundation/alias";
import { userGroupTable, userService, userTable } from "./service";

describe("userService", () => {
  beforeAll(async () => {
    await db.delete(userTable);
    await db.delete(userGroupTable);

    await db.insert(userGroupTable).values({ id: 1, name: "test" });
    await db
      .insert(userTable)
      .values({ id: 1, userGroupId: 1, username: "test", nickname: "Test", email: "test@resolid.tech" });
  });

  test("getLast", async () => {
    const user = await userService.getLast();

    expect(user?.id).toBe(1);
  });

  test("getByEmail", async () => {
    const user = await userService.getByEmail("test@resolid.tech");

    expect(user?.id).toBe(1);
    expect(user?.userGroup.id).toBe(1);
  });

  test("existByEmail", async () => {
    const exist = await userService.existByEmail("test@resolid.tech");

    expect(exist).toBe(true);
  });

  test("getByUsername", async () => {
    const user = await userService.getByUsername("test2");

    expect(user).toBe(undefined);
  });

  test("existByUsername", async () => {
    const exist = await userService.existByUsername("test2");

    expect(exist).toBe(false);
  });

  test("getByNickname", async () => {
    const user = await userService.getByNickname("Test");

    expect(user?.username).toBe("test");
  });

  test("getUserGroups", async () => {
    const groups = await userService.getUserGroups();

    expect(groups[0].name).toBe("test");
  });
});
