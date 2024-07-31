import { pgTable, serial, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const Product = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: decimal('price').notNull(),
  stock: integer('stock').notNull(),
  available: boolean('available').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});