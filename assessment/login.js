const exp = require('constants');
const crypto = require('crypto');

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

const database = require('./database.js');

async function checkPassword(username, password) {
    const login = await database.getLogin(username);
    if (login !== null) {
        const expectedHash = login.passwordHash;
        const actualHash = hashPassword(password, login.salt);
        return expectedHash === actualHash;
    } else {
        return false;
    }
}
exports.checkPassword = checkPassword;

async function createLogin(username, password) {
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
exports.createLogin = createLogin;
