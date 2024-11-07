import { exit } from "node:process";
import { format } from "@formkit/tempo";
import { hashSync } from "@node-rs/bcrypt";
import { Command, type CreateCommand } from "@resolid/framework/cli";
import { MySqlDialect, sql } from "@resolid/framework/drizzle";
import { RX_DEFAULT_AUTH_GROUP_ID } from "@resolid/framework/modules";
import { db } from "~/foundation/db.server";
import { adminGroupTable, adminTable } from "~/modules/admin/schema.server";
import { statusTable } from "~/modules/system/schema.server";
import { userGroupTable, userTable } from "~/modules/user/schema.server";

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
      const mysqlDialect = new MySqlDialect();

      await db.execute(mysqlDialect.sqlToQuery(sql`ALTER TABLE ${userTable} AUTO_INCREMENT=10011`).sql);

      await db
        .insert(adminGroupTable)
        .values([{ id: 101, name: "管理组" }])
        .onDuplicateKeyUpdate({ set: { id: sql`id` } });

      await db
        .insert(adminTable)
        .values({
          id: 1010,
          groupId: 101,
          username: "admin",
          nickname: "系统管理员",
          password: hashSync("123456"),
        })
        .onDuplicateKeyUpdate({ set: { id: sql`id` } });

      await db
        .insert(userGroupTable)
        .values({ id: RX_DEFAULT_AUTH_GROUP_ID, name: "普通用户" })
        .onDuplicateKeyUpdate({ set: { id: sql`id` } });

      await db
        .insert(statusTable)
        .values({
          id: 101,
          message: "系统初始化成功",
        })
        .onDuplicateKeyUpdate({ set: { id: sql`id` } });

      console.log("系统初始化成功");

      exit();
    });

  return cmd;
};
