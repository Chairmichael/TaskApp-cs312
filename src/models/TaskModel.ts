import db from "../db/Connection.js";
import type { Task } from "../types.js";

// loading saved tasks from the database.
export function findAll(): Task[] {
  return db.prepare<[], Task>(`
    SELECT *
    FROM tasks
    ORDER BY creation_timestamp DESC, id DESC
  `).all();
}