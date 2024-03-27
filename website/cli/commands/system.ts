import { format } from "@formkit/tempo";
import { Command, databaseSeed, type CreateCommand } from "@resolid/framework/cli";
import { exit } from "node:process";
import { statusTable } from "~/modules/system/schema.server";

export const systemCommand: CreateCommand = (db) => {
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
      await databaseSeed(db);

      await db
        .insert(statusTable)
        .values({
          id: 1,
          message: "系统初始化成功",
        })
        .onConflictDoNothing({
          target: statusTable.id,
        });

      console.log("系统初始化成功");

      exit();
    });

  return cmd;
};
