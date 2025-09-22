import { setup } from "@resolid/framework";
import { createCli } from "@resolid/framework/cli";
import { mailCommand } from "./commands/mail";
import { systemCommand } from "./commands/system";

setup();

createCli({
  commands: [mailCommand, systemCommand],
});
