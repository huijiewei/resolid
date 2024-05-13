import { argv } from "node:process";
import { Command } from "commander";
import { setup } from "../src";

const normalizeCommand = (command: Command) => {
  return command
    .configureOutput({
      outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`),
    })
    .showHelpAfterError()
    .helpCommand("help [command]", "显示命令的帮助")
    .exitOverride();
};

export { Command };

export type CreateCommand = () => Command;

setup();

export const createCli = ({ commands }: { commands: CreateCommand[] }) => {
  const program = new Command();

  program.name("resolid").description("Resolid 命令行工具").version("1.0.0");

  normalizeCommand(program);

  for (const command of commands) {
    program.addCommand(normalizeCommand(command()));
  }

  program.exitOverride();

  program
    .parseAsync(argv)
    .then(() => {})
    .catch(() => {});
};
