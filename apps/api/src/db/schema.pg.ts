import { pgTable, text, integer, real, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority', { enum: ['P0', 'P1', 'P2', 'P3'] }).notNull().default('P2'),
  status: text('status', { enum: ['backlog', 'in_progress', 'review', 'done', 'paused', 'failed'] }).notNull().default('backlog'),
  assigned_agent: text('assigned_agent').notNull().default('SINT'),
  estimated_hours: real('estimated_hours'),
  actual_hours: real('actual_hours'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  started_at: timestamp('started_at'),
  completed_at: timestamp('completed_at'),
  tags: text('tags').notNull().default('[]'), // JSON array as string
  session_key: text('session_key'),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const task_costs = pgTable('task_costs', {
  id: uuid('id').primaryKey().defaultRandom(),
  task_id: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  model: text('model').notNull(),
  input_tokens: integer('input_tokens').notNull(),
  output_tokens: integer('output_tokens').notNull(),
  cost_usd: real('cost_usd').notNull(),
  session_key: text('session_key'),
});
