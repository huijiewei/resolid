import { db } from "~/foundation/db.server";

export const statusService = {
  getFirst: () => {
    return db.query.statusTable.findFirst();
  },
};
