import argon2 from 'argon2';
import type { Request, Response } from 'express';
import * as Users from '../models/UserModel.js';
import type { AuthRequestBody, NewUser } from '../types.js';

// SQLite throws this if someone signs up with an email already in the db
function isUniqueConstraintError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error &&
        (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE');
}

export function showLogin(
    _req: Request,
    res: Response
): void {
    res.render('index', { error: null, showForm: 'login' });
}

export function showLoginWithError(
    _req: Request,
    res: Response,
    status: number,
    message: string,
    signup: boolean = false
): void {
    res.status(status).render('index', { error: { status: status, message: message }, showForm: signup ? 'signup' : 'login' });
}

export async function login(
    req: Request<Record<string, string>, unknown, AuthRequestBody>,
    res: Response
): Promise<void> {
    const { email: rawEmail, password } = req.body ?? {};
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';

    if (!email || typeof password !== 'string') {
        showLoginWithError(req, res, 400, 'Email and password are required.');
        return;
    }

    try {
        const user = Users.findCredentialsByEmail(email);
        if (!user || !(await argon2.verify(user.passwordHash, password))) {
            showLoginWithError(req, res, 401, 'Invalid email or password.');
            return;
        }

        req.session.userId = email;
        res.redirect(303, '/');
    } catch (error) {
        console.error('Login request failed:', error instanceof Error ? error.message : error);
        showLoginWithError(req, res, 500, 'Login failed. Please try again.');
    }
}

export async function signup(
    req: Request<Record<string, string>, unknown, AuthRequestBody>,
    res: Response
): Promise<void> {
    const { email: rawEmail, password, name: rawName } = req.body ?? {};
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const name = typeof rawName === 'string' ? rawName.trim() : '';

    if (
        email.length < 3 ||
        email.length > 254 ||
        typeof password !== 'string' ||
        password.length < 10 ||
        !name
    ) {
        showLoginWithError(req, res, 400, 'Signup details are invalid.', true);
        console.log('Signup details are invalid.', name, email, password);
        return;
    }

    try {
        const passwordHash = await argon2.hash(password);
        const newUser: NewUser = { email, name, passwordHash };
        try {
            Users.insert(newUser);
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                showLoginWithError(req, res, 409, 'Email is already registered.', true);
                return;
            }
            throw error;
        }

        req.session.userId = email;
        res.redirect(303, '/');
    } catch (error) {
        console.error('Signup request failed:', error instanceof Error ? error.message : error);
        showLoginWithError(req, res, 500, 'Signup failed. Please try again.', true);
    }
}

export function logout(req: Request, res: Response): void {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout request failed:', error.message);
            showLoginWithError(req, res, 500, 'Logout failed. Please try again.');
            return;
        }

        res.clearCookie('connect.sid');
        res.redirect(303, '/login');
    });
}
