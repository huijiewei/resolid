import { Command } from "commander";
import { spawn } from "node:child_process";
import type { CreateCommand } from "../index";

export const dbCommand: CreateCommand = () => {
  const cmd = new Command("db");

  cmd.description("数据库操作");

  cmd
    .command("push")
    .description("数据库推送")
    .action(() => {
      spawn("drizzle-kit", ["push:pg"], { stdio: "inherit", shell: true });
    });

  return cmd;
};
