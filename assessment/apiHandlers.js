const httpHelper = require('./httpHelper.js');

const login = require('./login.js');

async function handleRequest(request, result, url) {
    const pathname = url.pathname;
    const body = await httpHelper.getRequestBody(request);
    switch (pathname) {
        case '/api/login': {
            handleLogin(body, result);
            break;
        }
        case '/api/register': {
            handleRegister(body, result);
            break;
            }
        default:
            result.writeHead(404, { 'Content-Type': 'text/plain' });
            result.end('404 not found');
    }
}

exports.handle = handleRequest;

async function handleLogin(body, result) {
    const inputFields = httpHelper.parseFormData(body);
    const { username, password } = inputFields;
    const loginStatus = await login.checkPassword(username, password);
    let redirectUrl = '';
    if (loginStatus) {
        redirectUrl = '/yay.html';
    } else {
        redirectUrl = '/index.html';
    }
    result.writeHead(307, {
        Location: redirectUrl
    });
    result.end('Off you go!');
}

async function handleRegister(body, result) {
    const inputFields = httpHelper.parseFormData(body);
    const { username, password } = inputFields;    
    const registerStatus = await login.createLogin(username, password);
    let redirectUrl = '';
    if (registerStatus) {
        redirectUrl = '/yay.html';
    } else {
        redirectUrl = '/register.html';
    }
    // Add a cookie (loggedin = true)
    result.writeHead(307, {
        Location: redirectUrl
    });
    result.end('Off you go!');
}
