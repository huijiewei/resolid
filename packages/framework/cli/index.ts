import { Command } from "commander";
import { argv } from "node:process";
import { setup, type DatabaseInstance } from "../src";
import { databaseSeed, dbCommand } from "./commands/db";

const normalizeCommand = (command: Command) => {
  return command
    .configureOutput({
      outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`),
    })
    .showHelpAfterError()
    .helpCommand("help [command]", "显示命令的帮助")
    .exitOverride();
};

export { Command, databaseSeed };

export type CreateCommand = (db: DatabaseInstance) => Command;

setup();

export const createCli = ({ db, commands }: { db: DatabaseInstance; commands: CreateCommand[] }) => {
  const program = new Command();

  program.name("resolid").description("Resolid 命令行工具").version("1.0.0");

  normalizeCommand(program);

  program.addCommand(normalizeCommand(dbCommand(db)));

  for (const command of commands) {
    program.addCommand(normalizeCommand(command(db)));
  }

  program.exitOverride();

  program
    .parseAsync(argv)
    .then(() => {})
    .catch(() => {});
};
