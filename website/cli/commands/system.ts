import { exit } from "node:process";
import { format } from "@formkit/tempo";
import { hashSync } from "@node-rs/bcrypt";
import { Command, type CreateCommand } from "@resolid/framework/cli";
import { RX_DEFAULT_AUTH_GROUP_ID } from "@resolid/framework/modules";
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
        .values([{ name: "管理员" }])
        .onConflictDoNothing();

      await db
        .insert(adminTable)
        .values({
          groupId: RX_DEFAULT_AUTH_GROUP_ID,
          username: "admin",
          nickname: "系统管理员",
          password: hashSync("123456"),
        })
        .onConflictDoNothing();

      await db.insert(userGroupTable).values({ name: "普通用户" }).onConflictDoNothing();

      await db
        .insert(statusTable)
        .values({
          message: "系统初始化成功",
        })
        .onConflictDoNothing();

      console.log("系统初始化成功");

      exit();
    });

  return cmd;
};
