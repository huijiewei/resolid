import { createCli } from "@resolid/framework/cli";
import { db } from "~/foundation/db.server";
import { mailCommand } from "./commands/mail";

createCli({
  db: db,
  commands: [mailCommand],
});
