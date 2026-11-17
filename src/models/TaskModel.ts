import { randomUUID } from "node:crypto";
import db from "../db/Connection.js";
import type { NewTask, Task, TaskPriority } from "../types.js";

// loading saved tasks from the database.
export function findAll(): Task[] {
  return db.prepare<[], Task>(`
    SELECT *
    FROM tasks
    ORDER BY creation_timestamp DESC, id DESC
  `).all();
}

export function insertTask(task: NewTask): void {
  db.prepare<[
    string,
    string | null,
    string,
    TaskPriority,
    string,
    string,
    string | null,
  ]>(`
    INSERT INTO tasks (id, due_date, title, priority, body, creator_email, team_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    randomUUID(),
    task.due_date,
    task.title,
    task.priority,
    task.body,
    task.creator_email,
    task.team_id,
  );
}