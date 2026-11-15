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
    res.render('index');
}

export async function login(
    req: Request<Record<string, string>, unknown, AuthRequestBody>,
    res: Response
): Promise<void> {
    const { email: rawEmail, password } = req.body ?? {};
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';

    if (!email || typeof password !== 'string') {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const user = Users.findByEmail(email);
        if (!user || !(await argon2.verify(user.passwordHash, password))) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        req.session.userId = email;
        res.redirect(303, '/');
    } catch (error) {
        console.error('Login request failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
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
        res.status(400).json({ error: 'Signup details are invalid.' });
        return;
    }

    try {
        const passwordHash = await argon2.hash(password);
        const newUser: NewUser = { email, name, passwordHash };
        try {
            Users.insert(newUser);
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                res.status(409).json({ error: 'Email is already registered.' });
                return;
            }
            throw error;
        }

        req.session.userId = email;
        res.redirect(303, '/');
    } catch (error) {
        console.error('Signup request failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Signup failed. Please try again.' });
    }
}

export function logout(req: Request, res: Response): void {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout request failed:', error.message);
            res.status(500).json({ error: 'Logout failed. Please try again.' });
            return;
        }

        res.clearCookie('connect.sid');
        res.redirect(303, '/login');
    });
}
