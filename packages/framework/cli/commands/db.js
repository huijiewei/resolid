import { Command } from "commander";
import { spawn } from "node:child_process";

export const dbCommand = () => {
  const db = new Command("db");

  db.description("数据库操作").helpCommand(false);

  db.command("push")
    .description("数据库推送")
    .action(() => {
      spawn("drizzle-kit", ["push:pg"], { stdio: "inherit", shell: true });
    });

  db.command("seed")
    .description("数据库初始化填充")
    .action(() => {
      console.warn("数据库 seed");
    });

  db.command("help", { isDefault: true, hidden: true }).action(() => {
    db.help();
  });

  return db;
};
