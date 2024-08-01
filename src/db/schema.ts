import { pgTable, serial, text, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const Product = pgTable('product', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: decimal('price').notNull(),
  stock: integer('stock').notNull(),
  available: boolean('available').notNull(),
  categoryId: integer('category_id').notNull().references(() => Category.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
// many to one
export const productRelations = relations(Product, ({ one }) => ({
  category: one(Category, {
    fields: [Product.categoryId],
    references: [Category.id],
  }),
}));

export const Category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
// one to many
export const categoryRelations = relations(Category, ({ many }) => ({
  products: many(Product),
}));