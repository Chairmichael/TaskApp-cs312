import type { NextFunction, Request, Response } from "express";
import * as Tasks from "../models/TaskModel.js";
import type {
    CreateTaskRequestBody,
    NewTask,
    TaskPreview,
    TaskPriority,
} from "../types.js";

// Sample data used only for the layout preview.
const sampleTasks: TaskPreview[] = [
    {
        title: "Finish the task page",
        body: "Add the header and task cards.",
        due_date: "2026-11-20",
        priority: "high",
        status: "Open",
        assignee_email: "member1@example.com",
    },
    {
        title: "Test the login form",
        body: "Check the login form and its error messages.",
        due_date: "2026-11-21",
        priority: "medium",
        status: "In Progress",
        assignee_email: "member2@example.com",
    },
    {
        title: "Review the project notes",
        body: "Read the setup instructions.",
        due_date: "2026-11-22",
        priority: "low",
        status: "Completed",
        assignee_email: null,
    },
];

export function list(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const isPreview = req.query.preview === "1";

        res.render("tasks", {
            tasks: isPreview ? sampleTasks : Tasks.findAll(),
            isPreview,
        });
    } catch (error) {
        next(error);
    }
}

function isTaskPriority(value: unknown): value is TaskPriority {
    return value === "low" || value === "medium" || value === "high";
}

export function create(
    req: Request<Record<string, string>, unknown, CreateTaskRequestBody>,
    res: Response,
    next: NextFunction,
): void {
    const creatorEmail = req.session.userId;
    console.log('New task from: ', creatorEmail);
    if (!creatorEmail) {
        res.redirect('/login');
        return;
    }

    const { title: rawTitle, due_date: rawDueDate, priority, body: rawBody, team_id: rawTeamId } = req.body ?? {};
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';
    const body = typeof rawBody === 'string' ? rawBody.trim() : '';

    if (!title || !body || !isTaskPriority(priority)) {
        res.status(400).send('Title, description, and a valid priority are required.');
        return;
    }

    const dueDate = typeof rawDueDate === 'string' && rawDueDate.trim()
        ? rawDueDate.trim()
        : null;
    const teamId = typeof rawTeamId === 'string' && rawTeamId.trim()
        ? rawTeamId.trim()
        : null;
    const task: NewTask = {
        title,
        due_date: dueDate,
        priority,
        body,
        creator_email: creatorEmail,
        team_id: teamId,
    };

    try {
        Tasks.insertTask(task);
        res.redirect(303, '/tasks');
    } catch (error) {
        next(error);
    }
}

export function updateStatus(req: Request, res: Response) { }

export function remove(req: Request, res: Response) { }
