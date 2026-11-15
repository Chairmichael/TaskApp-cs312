import db from '../db/Connection.js';
// Only SQL functions

import type { NewUser, UserCredentials } from '../types.js';

export function insert(user: NewUser): void {
    // any db errors need to be caught by the caller
    db.prepare<[string, string, string]>(
        'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)'
    ).run(user.email, user.name, user.passwordHash);
}

export function findByEmail(email: string): UserCredentials | undefined {
    const user = db.prepare<[string], { name: string; password_hash: string }>(
        'SELECT name, password_hash FROM users WHERE email = ?'
    ).get(email);

    return user ? { name: user.name, passwordHash: user.password_hash } : undefined;
}