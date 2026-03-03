import { boolean, pgTable, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    plan: text('plan').notNull(),
    stripe_id: text('stripe_id').notNull(),
});

// Add this table
export const licenseKeysTable = pgTable('license_keys', {
    id: text('id').primaryKey(),
    key: text('key').notNull().unique(),
    email: text('email').notNull(),
    is_used: boolean('is_used').default(false),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
