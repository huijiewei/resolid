#!/usr/bin/env node

import { Command } from "commander";
import { argv } from "node:process";

import { dbCommand } from "./commands/db.js";

const program = new Command();

program
  .name("resolid")
  .description("Resolid 命令行工具")
  .version("1.0.0")
  .helpCommand(false)
  .command("help", { isDefault: true, hidden: true })
  .action(() => {
    program.help();
  })
  .addCommand(dbCommand())
  .parse(argv);
