import type { DatabaseInstance } from "./database";

// @ts-expect-error Cannot find module
import { db as dbInstance } from "@dbInstance";

export const db: DatabaseInstance = dbInstance;
