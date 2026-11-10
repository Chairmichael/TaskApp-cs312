import db from './Connection.js';

db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		email TEXT PRIMARY KEY NOT NULL,
		name TEXT NOT NULL,
		password_hash TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS teams (
		id TEXT PRIMARY KEY NOT NULL,
		team_lead_email TEXT,
		FOREIGN KEY (team_lead_email) REFERENCES users(email) ON DELETE SET NULL
	);

	CREATE TABLE IF NOT EXISTS team_members (
		team_id TEXT NOT NULL,
		user_email TEXT NOT NULL,
		PRIMARY KEY (team_id, user_email),
		FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
		FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS tasks (
		id TEXT PRIMARY KEY NOT NULL,
		creation_timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		due_date TEXT,
		title TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'pending',
		body TEXT NOT NULL,
		creator_email TEXT NOT NULL,
		assignee_email TEXT,
		team_id TEXT,
		FOREIGN KEY (creator_email) REFERENCES users(email),
		FOREIGN KEY (assignee_email) REFERENCES users(email) ON DELETE SET NULL,
		FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
	);

	CREATE INDEX IF NOT EXISTS tasks_assignee_email_idx ON tasks(assignee_email);
	CREATE INDEX IF NOT EXISTS tasks_team_id_idx ON tasks(team_id);
	CREATE INDEX IF NOT EXISTS team_members_user_email_idx ON team_members(user_email);
`);