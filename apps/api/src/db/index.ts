import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Use SQLite for both local and production (with persistent volume)
const dbPath = process.env.DATABASE_PATH || './data/sint_dashboard.db';

// Ensure data directory exists
const dataDir = dirname(dbPath);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL'); // Better performance

export const db = drizzle(sqlite, { schema });
