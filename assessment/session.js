const crypto = require('crypto');

const sessionTimeout = 1000 * 60 * 60;

let sessions = {};

function createSession(username) {
    let id = crypto.randomUUID();
    sessions[id] = username;
    setTimeout(() => {
        delete sessions[id];
    }, sessionTimeout);
    return id;
}
exports.createSession = createSession;

// Gets the username for the given session id or undefined if the session id is invalid.
function getUsername(id) {
    return sessions[id];
}
exports.getUsername = getUsername;
