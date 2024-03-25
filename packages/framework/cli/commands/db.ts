import { hashSync } from "@node-rs/bcrypt";
import { Command } from "commander";
import { spawn } from "node:child_process";
import { exit } from "node:process";
import { adminGroupTable, adminTable } from "../../src/modules/admin/schema";
import type { CreateCommand } from "../index";

export const dbCommand: CreateCommand = (db) => {
  const cmd = new Command("db");

  cmd.description("数据库操作");

  cmd
    .command("push")
    .description("数据库推送")
    .action(() => {
      spawn("drizzle-kit", ["push:pg"], { stdio: "inherit", shell: true });
    });

  cmd
    .command("seed")
    .description("数据库初始化填充")
    .action(async () => {
      await db
        .insert(adminGroupTable)
        .values([{ id: 1, name: "管理员" }])
        .onConflictDoNothing({
          target: adminGroupTable.id,
        });

      await db
        .insert(adminTable)
        .values({
          id: 1,
          adminGroupId: 1,
          username: "admin",
          nickname: "系统管理员",
          password: hashSync("123456"),
        })
        .onConflictDoNothing({
          target: adminTable.id,
        });

      console.log("数据库初始化填充成功");

      exit();
    });

  return cmd;
};
