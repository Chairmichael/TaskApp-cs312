export interface Task {
    id: string;
    creation_timestamp: string;
    due_date: string | null;
    title: string;
    status: string;
    body: string;
    creator_email: string;
    assignee_email: string | null;
    team_id: string | null;
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
