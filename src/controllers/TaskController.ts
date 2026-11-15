import type { Request, Response } from "express";

// temporary sample tasks for testing the page design.
// these tasks are not saved in the database.
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

export function list(req: Request, res: Response) {
  res.render("index", {
    tasks: req.query.preview === "1" ? sampleTasks : [],
  });
}

// these functions will be completed with the backend.
export function create(req: Request, res: Response) {}

export function updateStatus(req: Request, res: Response) {}

export function remove(req: Request, res: Response) {}