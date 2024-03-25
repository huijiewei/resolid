import { createCli } from "@resolid/framework/cli";
import { db } from "~/foundation/db.server";
import { mailCommand } from "./commands/mail";
import { systemCommand } from "./commands/system";

createCli({
  db: db,
  commands: [mailCommand, systemCommand],
});
