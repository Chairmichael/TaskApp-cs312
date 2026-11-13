import express from 'express';
import argon2 from 'argon2';
import type { Request, Response } from 'express';
import { addUser, findUserByEmail } from './controllers/UserController.js';
import './db/Schema.js';
import taskRoutes from './routes/TaskRoutes.js';
import type { AuthRequestBody, NewUser } from './types.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/tasks', taskRoutes);

app.listen(3000);

// SQLite throws this if someone signs up with an email already in the db
function isUniqueConstraintError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error &&
        (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE');
}

app.post('/auth', async (
    req: Request<Record<string, string>, unknown, AuthRequestBody>,
    res: Response
): Promise<void> => {
    const { action, email: rawEmail, password, name: rawName } = req.body ?? {};
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const name = typeof rawName === 'string' ? rawName.trim() : '';

    if ((action !== 'signin' && action !== 'signup') || !email || typeof password !== 'string') {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        if (action === 'signup') {
            if (email.length < 3 || email.length > 254 || password.length < 10 || !name) {
                res.status(400).json({ error: 'Signup details are invalid.' });
                return;
            }

            const passwordHash = await argon2.hash(password);
            const newUser: NewUser = { email, name, passwordHash };
            try {
                addUser(newUser);
            } catch (error) {
                if (isUniqueConstraintError(error)) {
                    res.status(409).json({ error: 'Email is already registered.' });
                    return;
                }
                throw error;
            }

            res.redirect(303, '/');
            return;
        }

        const user = findUserByEmail(email);
        if (!user || !(await argon2.verify(user.passwordHash, password))) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        res.redirect(303, '/');
    } catch (error) {
        console.error('Authentication request failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Authentication failed. Please try again.' });
    }
});