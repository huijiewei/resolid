import { db } from "~/foundation/db.server";

export const getStatus = () => {
  return db.query.status.findFirst();
};
