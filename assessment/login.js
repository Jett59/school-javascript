import crypto from 'crypto';

function hashPassword(password, salt) {
    const saltedPassword = password + salt;
    const hash = crypto.createHash('sha256');
    hash.update(saltedPassword);
    return hash.digest().toString('base64');
}

const saltLength = 24;

function createSalt() {
    return crypto.randomBytes(saltLength).toString('base64');
}

import * as database from './database.js';

export async function checkPassword(username, password) {
    const login = await database.getLogin(username);
    if (login !== null) {
        const expectedHash = login.passwordHash;
        const actualHash = hashPassword(password, login.salt);
        return expectedHash === actualHash;
    } else {
        return false;
    }
}

export async function createLogin(username, password) {
    const existingLogin = await database.getLogin(username);
    if (existingLogin === null) {
        const salt = createSalt();
        const passwordHash = hashPassword(password, salt);
        const login = {
            "username": username,
            "passwordHash": passwordHash,
            "salt": salt
        };
        await database.addLogin(login);
        return true;
    } else {
        return false;
    }
}
