import { db } from "~/foundation/db.server";

export const getStatus = async () => {
  return await db.query.status.findFirst().execute();
};
