import type { resolidDatabase } from "./database";

// @ts-expect-error Cannot find module
import { db as dbInstance } from "@dbInstance";

export const db: ReturnType<typeof resolidDatabase> = dbInstance;
