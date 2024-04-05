import { format } from "@formkit/tempo";
import { hashSync } from "@node-rs/bcrypt";
import { Command, type CreateCommand } from "@resolid/framework/cli";
import { exit } from "node:process";
import { db } from "~/foundation/db.server";
import { adminGroupTable, adminTable } from "~/modules/admin/schema.server";
import { statusTable } from "~/modules/system/schema.server";
import { userGroupTable } from "~/modules/user/schema.server";

export const systemCommand: CreateCommand = () => {
  const cmd = new Command("system");

  cmd.description("系统工具");

  cmd
    .command("time")
    .description("系统时间")
    .action(async () => {
      console.log(format(new Date(), "YYYY-MM-DD HH:mm Z"));
    });

  cmd
    .command("init")
    .description("系统初始化")
    .action(async () => {
      await db
        .insert(adminGroupTable)
        .values([{ id: 1, name: "管理员" }])
        .onConflictDoNothing();

      await db
        .insert(adminTable)
        .values({
          id: 1,
          groupId: 1,
          username: "admin",
          nickname: "系统管理员",
          password: hashSync("123456"),
        })
        .onConflictDoNothing();

      await db.insert(userGroupTable).values({ id: 1, name: "普通用户" }).onConflictDoNothing();

      await db
        .insert(statusTable)
        .values({
          id: 1,
          message: "系统初始化成功",
        })
        .onConflictDoNothing();

      console.log("系统初始化成功");

      exit();
    });

  return cmd;
};
