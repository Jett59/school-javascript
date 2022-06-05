const httpHelper = require('./httpHelper.js');

const login = require('./login.js');
const session = require('./session.js');
const database = require('./database.js');

async function handleRequest(request, response, url) {
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
        default:
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 not found');
    }
}
exports.handle = handleRequest;

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
        redirectUrl = '/index.html';
    }
    response.writeHead(307, {
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
        redirectUrl = '/register.html';
    }
    response.writeHead(307, {
        Location: redirectUrl
    });
    response.end('Off you go!');
}

async function handleList(request, response) {
    const cookies = httpHelper.getCookies(request);
    const sessionId = cookies['session'];
    const username = session.getUsername(sessionId);
    if (username !== undefined) {
        const list = await database.getNotes(username);
        const responseObject = { status: 'success', notes: list };
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(responseObject));
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('{"status": "failure"}');
    }
}
