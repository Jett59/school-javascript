const crypto = require('crypto');

let sessions = {};

function createSession(username) {
    let id = crypto.randomUUID();
    sessions[id] = username;
    return id;
}
exports.createSession = createSession;

// Gets the username for the given session id or undefined if the session id is invalid.
function getUsername(id) {
    return sessions[id];
}
exports.getUsername = getUsername;
