export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: string;
    creation_timestamp: string;
    due_date: string | null;
    title: string;
    priority: TaskPriority;
    status: string;
    body: string;
    creator_email: string;
    assignee_email: string | null;
    team_id: string | null;
}

export type TaskPreview = Pick<
    Task,
    "title" | "body" | "due_date" | "priority" | "status" | "assignee_email"
>;

export interface NewTask {
    title: string;
    due_date: string | null;
    priority: TaskPriority;
    body: string;
    creator_email: string;
    team_id: string | null;
}

export interface CreateTaskRequestBody {
    title?: unknown;
    due_date?: unknown;
    priority?: unknown;
    body?: unknown;
    team_id?: unknown;
}

export interface AuthRequestBody {
    email?: unknown;
    password?: unknown;
    name?: unknown;
}

export interface NewUser {
    email: string;
    name: string;
    passwordHash: string;
}

export interface User {
    email: string;
    name: string;
}

export interface UserCredentials {
    passwordHash: string;
}
