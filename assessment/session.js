import crypto from 'crypto';

const sessionTimeout = 1000 * 60 * 60;

let sessions = {};

export function createSession(username) {
    let id = crypto.randomUUID();
    sessions[id] = username;
    setTimeout(() => {
        delete sessions[id];
    }, sessionTimeout);
    return id;
}

// Gets the username for the given session id or undefined if the session id is invalid.
export function getUsername(id) {
    return sessions[id];
}
