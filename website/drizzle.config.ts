import { drizzleKitConfig } from "@resolid/framework";

export default drizzleKitConfig({
  schema: ["./src/modules/*/schema.server.ts"],
});
