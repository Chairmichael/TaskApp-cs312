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
