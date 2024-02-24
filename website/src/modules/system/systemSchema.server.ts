import { serial, text } from 'drizzle-orm/pg-core';
import { resolidTable } from '~/foundation/schema.server';

export const status = resolidTable('status', {
  id: serial('id').primaryKey(),
  message: text('message').notNull().default(''),
});
