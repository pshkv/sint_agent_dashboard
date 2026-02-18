import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password_hash: text('password_hash').notNull(),
  created_at: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority', { enum: ['P0', 'P1', 'P2', 'P3'] }).notNull().default('P2'),
  status: text('status', { enum: ['backlog', 'in_progress', 'review', 'done', 'paused', 'failed'] }).notNull().default('backlog'),
  assigned_agent: text('assigned_agent').notNull().default('SINT'),
  estimated_hours: real('estimated_hours'),
  actual_hours: real('actual_hours'),
  created_at: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  started_at: text('started_at'),
  completed_at: text('completed_at'),
  tags: text('tags').notNull().default('[]'), // JSON array as string
  session_key: text('session_key'),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const task_costs = sqliteTable('task_costs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  task_id: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  timestamp: text('timestamp').notNull().$defaultFn(() => new Date().toISOString()),
  model: text('model').notNull(),
  input_tokens: integer('input_tokens').notNull(),
  output_tokens: integer('output_tokens').notNull(),
  cost_usd: real('cost_usd').notNull(),
  session_key: text('session_key'),
});
