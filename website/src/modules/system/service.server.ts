import { db } from "~/foundation/db.server";

export const statusService = {
  getFirst: async () => {
    return db.query.statusTable.findFirst();
  },
};
