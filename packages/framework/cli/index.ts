import { Command } from "commander";
import { argv } from "node:process";
import { dbCommand } from "./commands/db.js";

const normalizeCommand = (command: Command) => {
  return command
    .configureOutput({
      outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`),
    })
    .showHelpAfterError()
    .helpCommand("help [command]", "显示命令的帮助")
    .exitOverride();
};

export const createCli = (...commands: (() => Command)[]) => {
  const program = new Command();

  program.name("resolid").description("Resolid 命令行工具").version("1.0.0");

  normalizeCommand(program);

  program.addCommand(normalizeCommand(dbCommand()));

  for (const command of commands) {
    program.addCommand(normalizeCommand(command()));
  }

  program.exitOverride();

  try {
    program.parse(argv);
  } catch {
    /* empty */
  }
};

export { Command };
