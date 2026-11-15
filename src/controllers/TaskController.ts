import type { NextFunction, Request, Response } from "express";
import * as Tasks from "../models/TaskModel.js";

// Sample data used only for the layout preview.
const sampleTasks = [
    {
        title: "Finish the task page",
        body: "Add the header and task cards.",
        due_date: "2026-11-20",
        priority: "High",
        status: "Open",
        assignee_email: "member1@example.com",
    },
    {
        title: "Test the login form",
        body: "Check the login form and its error messages.",
        due_date: "2026-11-21",
        priority: "Medium",
        status: "In Progress",
        assignee_email: "member2@example.com",
    },
    {
        title: "Review the project notes",
        body: "Read the setup instructions.",
        due_date: "2026-11-22",
        priority: "Low",
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

// These functions will be completed with the backend.
export function create(req: Request, res: Response) { }

export function updateStatus(req: Request, res: Response) { }

export function remove(req: Request, res: Response) { }