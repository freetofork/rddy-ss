import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    id: text('id').primaryKey(), // Existing schema uses text for user ID
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    plan: text('plan').notNull(),
    stripe_id: text('stripe_id').notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const licenseKeysTable = pgTable('license_keys', {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull().unique(),
    email: text('email').notNull(),
    isUsed: boolean('is_used').default(false),
    plan: text('plan'),
    activeDeviceId: uuid('active_device_id'),
    activatedAt: timestamp('activated_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const supportTicketsTable = pgTable('support_tickets', {
    id: uuid('id').primaryKey().defaultRandom(),
    ticketNumber: text('ticket_number').notNull().unique(),
    email: text('email').notNull(),
    category: text('category').notNull(), // 'Bug Report' | 'Feature Request'
    message: text('message').notNull(),
    adminResponse: text('admin_response'),
    status: text('status').notNull().default('open'), // 'open' | 'answered' | 'closed'
    isRead: boolean('is_read').notNull().default(false),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type SupportTicket = typeof supportTicketsTable.$inferSelect;
