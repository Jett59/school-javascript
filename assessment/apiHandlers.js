const httpHelper = require('./httpHelper.js');

async function handleRequest(request, result, url) {
    const pathname = url.pathname;
    const body = await httpHelper.getRequestBody(request);
    switch (pathname) {
        case '/api/login': {
            handleLogin(body, result);
            break;
        }
    }
}

exports.handle = handleRequest;

function handleLogin(body, result) {
    const inputFields = httpHelper.parseFormData(body);
    const { username, password } = inputFields;
    console.log(`Login request for user ${username}`);
    console.log(password);
}
