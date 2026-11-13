import db from '../db/Connection.js';
// Only SQL functions

import type { NewUser, UserCredentials } from '../types.js';

export function addUser(user: NewUser): void {
    void user;
    throw new Error('UserController.addUser is not implemented.');
}

export function findUserByEmail(email: string): UserCredentials | undefined {
    void email;
    throw new Error('UserController.findUserByEmail is not implemented.');
}