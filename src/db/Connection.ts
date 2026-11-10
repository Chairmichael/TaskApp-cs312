import Database from 'better-sqlite3';

const db: Database.Database = new Database('tasks.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;