import { db } from "~/foundation/db.server";
import { statusTable } from "~/modules/system/schema.server";

export const statusService = {
  getFirst: async () => {
    const status = await db.select().from(statusTable).limit(1);

    return status.length > 0 ? status[0] : undefined;
  },
};
