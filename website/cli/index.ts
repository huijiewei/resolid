import { createCli } from "@resolid/framework/cli";
import { mailCommand } from "./commands/mail";
import { systemCommand } from "./commands/system";

createCli({
  commands: [mailCommand, systemCommand],
});
