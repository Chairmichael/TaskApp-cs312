import db from '../db/Connection.js';
// Only SQL functions

import type { NewUser, User, UserCredentials } from '../types.js';

export function insert(user: NewUser): void {
    // any db errors need to be caught by the caller
    db.prepare<[string, string, string]>(
        'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)'
    ).run(user.email, user.name, user.passwordHash);
}

export function findByEmail(email: string): User | undefined {
    return db.prepare<[string], User>(
        'SELECT email, name FROM users WHERE email = ?'
    ).get(email);
}

export function findCredentialsByEmail(email: string): UserCredentials | undefined {
    const user = db.prepare<[string], { password_hash: string }>(
        'SELECT password_hash FROM users WHERE email = ?'
    ).get(email);

    return user ? { passwordHash: user.password_hash } : undefined;
}

export function findAll(): User[] {
    return db.prepare<[], User>(
        'SELECT email, name FROM users ORDER BY email'
    ).all();
}