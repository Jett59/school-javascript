import * as httpHelper from './httpHelper.js';

import * as login from './login.js';
import * as session from './session.js';
import * as database from './database.js';

export async function handle(request, response, url) {
    const pathname = url.pathname;
    const body = await httpHelper.getRequestBody(request);
    switch (pathname) {
        case '/api/login': {
            handleLogin(body, response);
            break;
        }
        case '/api/register': {
            handleRegister(body, response);
            break;
        }
        case '/api/list': {
            handleList(request, response);
            break;
        }
        case '/api/create': {
            handleCreate(request, response, body);
            break;
        }
        case '/api/delete': {
            handleDelete(request, response, url.query);
            break;
        }
        case '/api/get': {
            handleGet(request, response, url.query);
            break;
        }
        case '/api/update': {
            handleUpdate(request, response, body);
            break;
        }
        default:
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 not found');
    }
}

function logIn(username, response) {
    httpHelper.createCookie('session', session.createSession(username), response);
}

async function handleLogin(body, response) {
    const inputFields = httpHelper.parseUrlEncodedList(body);
    const { username, password } = inputFields;
    const loginStatus = await login.checkPassword(username, password);
    let redirectUrl = '';
    if (loginStatus) {
        redirectUrl = '/index.html';
        logIn(username, response);
    } else {
        redirectUrl = '/login.html?error=access+denied';
    }
    response.writeHead(303, {
        Location: redirectUrl
    });
    response.end('Off you go!');
}

async function handleRegister(body, response) {
    const inputFields = httpHelper.parseUrlEncodedList(body);
    const { username, password } = inputFields;
    const registerStatus = await login.createLogin(username, password);
    let redirectUrl = '';
    if (registerStatus) {
        redirectUrl = '/index.html';
        logIn(username, response);
    } else {
        redirectUrl = '/register.html?error=already+used';
    }
    response.writeHead(303, {
        Location: redirectUrl
    });
    response.end('Off you go!');
}

async function handleList(request, response) {
    const cookies = httpHelper.getCookies(request);
    const sessionId = cookies['session'];
    const username = session.getUsername(sessionId);
    if (username !== undefined) {
        const rawList = await database.getNotes(username);
        let list = [];
        for (var note of rawList) {
            list.push({
                id: note._id,
                title: note.title,
                content: note.content
            });
        }
        const responseObject = { status: 'success', notes: list };
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(responseObject));
    } else {
        response.writeHead(403, {
            'Content-Type': 'text/plain'
        });
        response.end('{"status": "failure"}');
    }
}

async function handleCreate(request, response, body) {
    const cookies = httpHelper.getCookies(request);
    const sessionId = cookies['session'];
    const username = session.getUsername(sessionId);
    if (username !== undefined) {
        const inputFields = httpHelper.parseUrlEncodedList(body);
        const title = inputFields.title;
        const noteId = await database.createNote(username, title);
        response.writeHead(201, {
            'Content-Type': 'application/json'
        });
        response.end(`{"id": "${noteId}"}`);
    } else {
        response.writeHead(303, {
            Location: '/login.html'
        });
        response.end('Log In!');
    }
}

async function handleDelete(request, response, query) {
    const cookies = httpHelper.getCookies(request);
    const sessionId = cookies['session'];
    const username = session.getUsername(sessionId);
    if (username !== undefined) {
        const noteId = query.id;
        await database.deleteNote(username, noteId);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end('{"status": "success"}');
    } else {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('{"status": "failure"}');
    }
}

async function handleGet(request, response, query) {
    const cookies = httpHelper.getCookies(request);
    const sessionId = cookies['session'];
    const username = session.getUsername(sessionId);
    if (username !== undefined) {
        const noteId = query.id;
        const rawNote = await database.getNote(username, noteId);
        const note = {
            id: rawNote._id,
            title: rawNote.title,
            content: rawNote.content
        };
        const responseObject = {
            status: 'success',
            note: note
        };
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(responseObject));
    } else {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('{"status": "failure"}');
    }
}

async function handleUpdate(request, response, body) {
    const cookies = httpHelper.getCookies(request);
    const sessionId = cookies['session'];
    const username = session.getUsername(sessionId);
    if (username !== undefined) {
        const inputFields = httpHelper.parseUrlEncodedList(body);
        const { id, title, content } = inputFields;
        await database.updateNote(username, id, title, content);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end('{"status": "success"}');
    } else {
        response.writeHead(403, {
            'Content-type': 'application/json'
        });
        response.end('{"status": "access denied"}');
    }
}
